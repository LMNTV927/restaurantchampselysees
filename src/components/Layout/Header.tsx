import { motion } from "framer-motion";
import { Crown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "links", label: "Liens" },
  { id: "reservations", label: "Réservations" },
  { id: "data", label: "Données" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <img 
                src="/assets/prince-palace-logo-new.png" 
                alt="Prince Palace Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-playfair font-semibold text-foreground">
                Prince Palace
              </h1>
              <p className="text-xs text-muted-foreground">
                Réservations & Tracking
              </p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-card/50 rounded-2xl p-1 backdrop-blur-sm">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-6 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-gold rounded-xl shadow-gold"
                    layoutId="activeTab"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl border-border/50 hover:bg-accent/20 transition-all duration-300"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}