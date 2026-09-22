import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import type { ReservationData } from "@/hooks/useRealtimeReservations";

/** Clé client : 9 derniers chiffres du numéro. */
export function phoneKey(phone: string | null | undefined): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : digits;
}

const formatDate = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  reservations: ReservationData[];
}

export function CustomerHistoryDialog({ open, onOpenChange, phone, reservations }: Props) {
  const key = phoneKey(phone);

  const history = key
    ? reservations
        .filter((r) => phoneKey(r.customerPhone) === key)
        .sort((a, b) =>
          `${b.reservationDate}T${b.reservationTime}`.localeCompare(`${a.reservationDate}T${a.reservationTime}`)
        )
    : [];

  const total = history.length;
  const shows = history.filter((r) => r.status === "show");
  const noShows = history.filter((r) => r.status === "no_show").length;
  const cancelled = history.filter((r) => r.status === "cancelled").length;
  const covers = history.reduce((s, r) => s + (r.guestsCount || 0), 0);
  const denom = shows.length + noShows;
  const attendance = denom > 0 ? `${Math.round((shows.length / denom) * 100)} %` : "—";

  const dates = history.map((r) => r.reservationDate).sort();
  const firstReservation = dates.length ? formatDate(dates[0]) : "—";
  const lastShowDate = shows.map((r) => r.reservationDate).sort().pop();
  const lastShow = lastShowDate ? formatDate(lastShowDate) : "—";

  const name = history[0]?.customerName || "Client";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {name}
            {shows.length >= 3 && (
              <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                Client fidèle
              </Badge>
            )}
          </DialogTitle>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm text-primary hover:underline">
            {phone}
          </a>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span><span className="font-semibold text-foreground">{total}</span> réservations</span>
            <span>·</span>
            <span><span className="font-semibold text-foreground">{shows.length}</span> venues</span>
            <span>·</span>
            <span><span className="font-semibold text-foreground">{noShows}</span> absences</span>
            <span>·</span>
            <span><span className="font-semibold text-foreground">{cancelled}</span> annulations</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="premium-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Couverts cumulés</p>
              <p className="font-semibold text-foreground">{covers}</p>
            </div>
            <div className="premium-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Taux de présence</p>
              <p className="font-semibold text-foreground">{attendance}</p>
            </div>
            <div className="premium-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Première réservation</p>
              <p className="font-semibold text-foreground">{firstReservation}</p>
            </div>
            <div className="premium-card rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Dernière venue</p>
              <p className="font-semibold text-foreground">{lastShow}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">5 dernières réservations</p>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {history.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 p-2 text-sm">
                  <div className="min-w-0">
                    <p className="text-foreground">
                      {formatDate(r.reservationDate)} · {r.reservationTime.slice(0, 5)}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.guestsCount} pers.</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune réservation trouvée.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
