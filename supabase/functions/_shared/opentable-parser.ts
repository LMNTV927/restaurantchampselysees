/* ---------- Shared OpenTable e-mail parser ---------- */

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|td|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

const MONTHS: Record<string, number> = {
  janvier: 1, janv: 1, january: 1, jan: 1,
  "février": 2, fevrier: 2, "févr": 2, fevr: 2, february: 2, feb: 2,
  mars: 3, march: 3, mar: 3,
  avril: 4, avr: 4, april: 4, apr: 4,
  mai: 5, may: 5,
  juin: 6, june: 6, jun: 6,
  juillet: 7, juil: 7, july: 7, jul: 7,
  "août": 8, aout: 8, august: 8, aug: 8,
  septembre: 9, sept: 9, september: 9, sep: 9,
  octobre: 10, oct: 10, october: 10,
  novembre: 11, nov: 11, november: 11,
  "décembre": 12, decembre: 12, "déc": 12, dec: 12, december: 12,
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function parseDate(text: string): string | null {
  let m = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  m = text.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})\b/);
  if (m) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;

  m = text.match(/\b(\d{1,2})(?:er)?\s+([A-Za-zÀ-ÿ]{3,10})\.?\s*(20\d{2})?/);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month) {
      const year = m[3] ? +m[3] : new Date().getFullYear();
      return `${year}-${pad(month)}-${pad(+m[1])}`;
    }
  }

  m = text.match(/\b([A-Za-z]{3,10})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(20\d{2})?/);
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month) {
      const year = m[3] ? +m[3] : new Date().getFullYear();
      return `${year}-${pad(month)}-${pad(+m[2])}`;
    }
  }
  return null;
}

export function parseTime(text: string): string | null {
  let m = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  if (m) {
    let h = +m[1] % 12;
    if (m[3].toUpperCase() === "PM") h += 12;
    return `${pad(h)}:${m[2] ?? "00"}`;
  }

  m = text.match(/\b(\d{1,2})\s*[h:]\s*(\d{2})\b/i);
  if (m) return `${pad(+m[1])}:${m[2]}`;

  m = text.match(/\b(\d{1,2})\s*h\b/i);
  if (m) return `${pad(+m[1])}:00`;
  return null;
}

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

export interface ParsedReservation {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  time: string;
  guests: number;
  externalId: string | null;
  cancelled: boolean;
  notes: string | null;
}

export function parseOpenTableEmail(subject: string, body: string): ParsedReservation | null {
  const text = `${subject}\n${body}`;

  const cancelled = /annul(?:é|ation|e)|cancell?ed|cancellation/i.test(subject) ||
    /r[ée]servation annul[ée]e|reservation (?:has been )?cancell?ed/i.test(body);

  const name =
    firstMatch(text, [
      /(?:Nom(?:\s+du\s+client)?|Client|Invit[ée]|Guest(?:\s+name)?|Name)\s*[:\-]\s*([A-Za-zÀ-ÿ'’\-\. ]{2,60})/i,
      /(?:R[ée]servation (?:de|pour)|Reservation for)\s+([A-Za-zÀ-ÿ'’\-\. ]{2,60})/i,
    ]) ?? null;

  const guestsRaw = firstMatch(text, [
    /(?:Nombre de (?:personnes|couverts|convives)|Couverts|Convives|Party size|Guests|People)\s*[:\-]?\s*(\d{1,3})/i,
    /\b(\d{1,3})\s*(?:personnes?|couverts?|convives?|guests?|people)\b/i,
  ]);

  const dateLine = firstMatch(text, [
    /(?:Date(?:\s+de\s+la\s+r[ée]servation)?|Date)\s*[:\-]\s*([^\n]{4,60})/i,
  ]);
  const timeLine = firstMatch(text, [
    /(?:Heure|Time|Horaire)\s*[:\-]\s*([^\n]{2,30})/i,
  ]);

  const date = (dateLine && parseDate(dateLine)) ?? parseDate(text);
  const time = (timeLine && parseTime(timeLine)) ?? parseTime(text);

  if (!name || !date || !time) return null;

  const phone =
    firstMatch(text, [
      /(?:T[ée]l[ée]phone|Tel|Phone|Mobile)\s*[:\-]?\s*(\+[\d\s().\-]{8,20})/i,
    ])?.replace(/[^\d+]/g, "") ?? "";

  const email = firstMatch(text, [
    /(?:E-?mail|Courriel)\s*[:\-]?\s*([\w.+\-]+@[\w\-]+\.[\w.\-]+)/i,
  ]);

  const externalId = firstMatch(text, [
    /(?:Num[ée]ro de (?:r[ée]servation|confirmation)|Confirmation (?:number|#)|R[ée]f[ée]rence|Reservation ID)\s*[:#\-]?\s*([A-Za-z0-9\-]{4,32})/i,
  ]);

  const notes = firstMatch(text, [
    /(?:Notes?|Demandes? sp[ée]ciales?|Special requests?|Commentaires?)\s*[:\-]\s*([^\n]{2,300})/i,
  ]);

  return {
    customerName: name.replace(/\s+/g, " ").trim(),
    customerPhone: phone,
    customerEmail: email,
    date,
    time,
    guests: guestsRaw ? Math.min(parseInt(guestsRaw, 10), 500) : 2,
    externalId,
    cancelled,
    notes,
  };
}
