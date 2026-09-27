/* ---------- Minimal IMAP client (Deno, TLS) ---------- */

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: false });

export interface ImapConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
}

export class ImapClient {
  private conn: Deno.TlsConn | null = null;
  private buffer = "";
  private counter = 0;

  constructor(private config: ImapConfig) {}

  async connect(): Promise<void> {
    this.conn = await Deno.connectTls({
      hostname: this.config.hostname,
      port: this.config.port,
    });
    // Server greeting
    await this.readUntil((chunk) => /\r\n/.test(chunk));
    this.buffer = "";
    await this.command(
      `LOGIN ${quote(this.config.username)} ${quote(this.config.password)}`,
    );
  }

  async close(): Promise<void> {
    try {
      if (this.conn) {
        await this.command("LOGOUT").catch(() => {});
        this.conn.close();
      }
    } catch {
      // ignore
    }
    this.conn = null;
  }

  private async write(text: string): Promise<void> {
    if (!this.conn) throw new Error("IMAP: not connected");
    await this.conn.write(encoder.encode(text));
  }

  private async readUntil(done: (buffer: string) => boolean): Promise<string> {
    if (!this.conn) throw new Error("IMAP: not connected");
    const chunk = new Uint8Array(65536);
    while (!done(this.buffer)) {
      const read = await this.conn.read(chunk);
      if (read === null) break;
      this.buffer += decoder.decode(chunk.subarray(0, read));
    }
    const result = this.buffer;
    this.buffer = "";
    return result;
  }

  /** Runs a command and returns the full untagged + tagged response. */
  async command(command: string): Promise<string> {
    this.counter += 1;
    const tag = `A${this.counter.toString().padStart(4, "0")}`;
    await this.write(`${tag} ${command}\r\n`);

    const matcher = new RegExp(`^${tag} (OK|NO|BAD)(.*)$`, "m");
    const response = await this.readUntil((buf) => matcher.test(buf));
    const status = response.match(matcher);
    if (!status) throw new Error(`IMAP: réponse incomplète pour « ${command} »`);
    if (status[1] !== "OK") {
      throw new Error(`IMAP ${status[1]}: ${status[2].trim()} (${command.split(" ")[0]})`);
    }
    return response;
  }

  async selectMailbox(mailbox = "INBOX"): Promise<void> {
    await this.command(`SELECT ${quote(mailbox)}`);
  }

  /** Returns message sequence numbers matching the search criteria. */
  async search(criteria: string): Promise<number[]> {
    const response = await this.command(`SEARCH ${criteria}`);
    const line = response.split(/\r\n/).find((l) => /^\* SEARCH/i.test(l));
    if (!line) return [];
    return line
      .replace(/^\* SEARCH/i, "")
      .trim()
      .split(/\s+/)
      .filter((n) => /^\d+$/.test(n))
      .map(Number);
  }

  /** Fetches the raw RFC822 source of a message without marking it as read. */
  async fetchRaw(seq: number): Promise<string> {
    const response = await this.command(`FETCH ${seq} (BODY.PEEK[])`);
    const start = response.indexOf("}\r\n");
    if (start === -1) return response;
    const end = response.lastIndexOf(")\r\n");
    return response.slice(start + 3, end === -1 ? undefined : end);
  }
}

function quote(value: string): string {
  return `"${value.replace(/(["\\])/g, "\\$1")}"`;
}

/* ---------- MIME helpers ---------- */

function decodeQuotedPrintable(input: string): string {
  const bytes: number[] = [];
  const text = input.replace(/=\r?\n/g, "");
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "=" && /^[0-9A-Fa-f]{2}$/.test(text.slice(i + 1, i + 3))) {
      bytes.push(parseInt(text.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(text.charCodeAt(i));
    }
  }
  return decoder.decode(new Uint8Array(bytes));
}

function decodeBase64(input: string): string {
  try {
    const clean = input.replace(/\s+/g, "");
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return decoder.decode(bytes);
  } catch {
    return input;
  }
}

function decodeBody(body: string, encoding: string): string {
  const enc = encoding.toLowerCase();
  if (enc.includes("quoted-printable")) return decodeQuotedPrintable(body);
  if (enc.includes("base64")) return decodeBase64(body);
  return body;
}

/** Decodes RFC 2047 encoded-words found in headers (=?UTF-8?B?...?=). */
export function decodeHeaderValue(value: string): string {
  return value.replace(
    /=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g,
    (_all, _charset, kind, payload) =>
      kind.toUpperCase() === "B"
        ? decodeBase64(payload)
        : decodeQuotedPrintable(payload.replace(/_/g, " ")),
  );
}

export interface ParsedEmail {
  subject: string;
  from: string;
  messageId: string;
  date: string;
  html: string;
  text: string;
}

/** Parses a raw RFC822 message into its headers and text/html parts. */
export function parseRawEmail(raw: string): ParsedEmail {
  const normalized = raw.replace(/\r\n/g, "\n");
  const separator = normalized.indexOf("\n\n");
  const headerBlock = separator === -1 ? normalized : normalized.slice(0, separator);
  const bodyBlock = separator === -1 ? "" : normalized.slice(separator + 2);

  const unfolded = headerBlock.replace(/\n[ \t]+/g, " ");
  const header = (name: string): string => {
    const match = unfolded.match(new RegExp(`^${name}:\\s*(.*)$`, "im"));
    return match ? decodeHeaderValue(match[1].trim()) : "";
  };

  const contentType = (unfolded.match(/^Content-Type:\s*(.*)$/im)?.[1] ?? "").trim();
  const encoding = (unfolded.match(/^Content-Transfer-Encoding:\s*(.*)$/im)?.[1] ?? "").trim();

  let html = "";
  let text = "";

  const boundary = contentType.match(/boundary="?([^";]+)"?/i)?.[1];
  if (boundary) {
    const parts = bodyBlock.split(new RegExp(`--${escapeRegExp(boundary)}(?:--)?\\s*\n?`));
    for (const part of parts) {
      const partSep = part.indexOf("\n\n");
      if (partSep === -1) continue;
      const partHeaders = part.slice(0, partSep).replace(/\n[ \t]+/g, " ");
      const partBody = part.slice(partSep + 2);
      const partType = partHeaders.match(/^Content-Type:\s*(.*)$/im)?.[1] ?? "";
      const partEncoding = partHeaders.match(/^Content-Transfer-Encoding:\s*(.*)$/im)?.[1] ?? "";
      const nestedBoundary = partType.match(/boundary="?([^";]+)"?/i)?.[1];
      if (nestedBoundary) {
        const nested = parseRawEmail(`Content-Type: ${partType}\n\n${partBody}`);
        html = html || nested.html;
        text = text || nested.text;
        continue;
      }
      const decoded = decodeBody(partBody, partEncoding);
      if (/text\/html/i.test(partType)) html = html || decoded;
      else if (/text\/plain/i.test(partType)) text = text || decoded;
    }
  } else {
    const decoded = decodeBody(bodyBlock, encoding);
    if (/text\/html/i.test(contentType)) html = decoded;
    else text = decoded;
  }

  return {
    subject: header("Subject"),
    from: header("From"),
    messageId: header("Message-ID"),
    date: header("Date"),
    html,
    text,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Formats a date as the IMAP SEARCH date literal, e.g. 27-Sep-2026. */
export function imapDate(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${date.getUTCDate()}-${months[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}
