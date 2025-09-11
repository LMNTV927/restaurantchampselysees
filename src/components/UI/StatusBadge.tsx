import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatusType = "confirmed" | "show" | "no_show" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  confirmed: {
    label: "Confirmé",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  show: {
    label: "Présent",
    className: "bg-success/20 text-success border-success/30",
  },
  no_show: {
    label: "Absent",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  cancelled: {
    label: "Annulé",
    className: "bg-muted/20 text-muted-foreground border-muted/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <motion.span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200",
        config.className,
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {config.label}
    </motion.span>
  );
}