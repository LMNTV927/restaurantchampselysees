import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  prefix = "", 
  suffix = "", 
  icon: Icon, 
  trend, 
  loading = false 
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="premium-card p-6 group hover:shadow-medium transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              ) : (
                <motion.p 
                  className="text-3xl font-bold count-up text-foreground"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    ease: "easeOut"
                  }}
                >
                  {prefix}{value.toLocaleString()}{suffix}
                </motion.p>
              )}
              {trend && (
                <motion.span 
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-success" : "text-destructive"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </motion.span>
              )}
            </div>
          </div>
          
          <motion.div 
            className="p-3 bg-gradient-gold rounded-xl shadow-gold group-hover:shadow-large transition-all duration-300"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-6 w-6 text-charcoal" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}