import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRealtimeReservations, type ReservationData } from "@/hooks/useRealtimeReservations";
import { CustomerHistoryDialog, phoneKey } from "@/components/Reservations/CustomerHistoryDialog";

interface ClientRow {
  phoneKey: string;
  phone: string;
  name: string;
  email: string;
  reservationCount: number;
  latest: ReservationData;
}

const buildClients = (reservations: ReservationData[]): ClientRow[] => {
  const map = new Map<string, ClientRow>();

  for (const r of reservations) {
    const key = phoneKey(r.customerPhone);
    if (!key) continue;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        phoneKey: key,
        phone: r.customerPhone,
        name: r.customerName,
        email: r.customerEmail?.trim() || "",
        reservationCount: 1,
        latest: r,
      });
      continue;
    }

    existing.reservationCount += 1;
    const isMoreRecent = `${r.reservationDate}T${r.reservationTime}`.localeCompare(
      `${existing.latest.reservationDate}T${existing.latest.reservationTime}`
    ) > 0;
    if (isMoreRecent) {
      existing.latest = r;
      existing.phone = r.customerPhone;
      existing.name = r.customerName;
    }
    if (!existing.email && r.customerEmail?.trim()) {
      existing.email = r.customerEmail.trim();
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      b.reservationCount - a.reservationCount ||
      a.name.localeCompare(b.name, "fr")
  );
};

const exportClientsPDF = (clients: ClientRow[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0);
  doc.text("PRINCE PALACE", 14, 20);
  doc.setFontSize(13);
  doc.setFont(undefined, "normal");
  doc.text("Liste des clients", 14, 30);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} — ${clients.length} client(s)`,
    14,
    38
  );

  autoTable(doc, {
    startY: 45,
    head: [["Nom", "Email", "Téléphone", "Réservations"]],
    body: clients.map((c) => [
      c.name || "—",
      c.email || "—",
      c.phone || "—",
      c.reservationCount.toString(),
    ]),
    theme: "striped",
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    columnStyles: { 3: { halign: "center" } },
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Prince Palace - Liste des clients - Page ${i}/${pages}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`prince-palace-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export function ClientsSection() {
  const { reservations } = useRealtimeReservations();
  const [search, setSearch] = useState("");
  const [openPhone, setOpenPhone] = useState<string | null>(null);

  const clients = useMemo(() => buildClients(reservations), [reservations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    const qDigits = q.replace(/\D/g, "");
    return clients.filter((c) => {
      const byName = c.name.toLowerCase().includes(q);
      const byEmail = c.email.toLowerCase().includes(q);
      const byPhone =
        qDigits.length > 0 && c.phone.replace(/\D/g, "").includes(qDigits);
      return byName || byEmail || byPhone;
    });
  }, [clients, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => exportClientsPDF(clients)} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="premium-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs uppercase tracking-wide">Nom</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Email</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Téléphone</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-right">Réservations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.phoneKey}
                  onClick={() => setOpenPhone(c.phone)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {c.reservationCount}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CustomerHistoryDialog
        open={openPhone !== null}
        onOpenChange={(open) => {
          if (!open) setOpenPhone(null);
        }}
        phone={openPhone ?? ""}
        reservations={reservations}
      />
    </div>
  );
}
