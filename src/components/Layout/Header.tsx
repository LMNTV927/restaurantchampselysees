import { motion } from "framer-motion";
import { Moon, Sun, LogOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import floorPlanImg from "@/assets/floor-plan.jpeg";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const allTabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "links", label: "Liens" },
  { id: "reservations", label: "Réservations" },
  { id: "data", label: "Données" },
  { id: "clients", label: "Clients" },
  { id: "assistant", label: "Assistant IA" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { role, signOut } = useAuth();

  const tabs = role === "serveur"
    ? allTabs.filter((t) => t.id === "reservations")
    : allTabs;

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20 rounded-xl overflow-hidden">
              <img
                src="/assets/prince-palace-logo-new.png"
                alt="Prince Palace Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-base sm:text-lg lg:text-xl font-playfair font-semibold text-foreground">
                Prince Palace
              </h1>
              <p className="text-xs text-muted-foreground">
                {role === "serveur" ? "Espace Serveur" : "Réservations & Tracking"}
              </p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <nav className="flex justify-center sm:justify-end">
            <div className="flex items-center bg-card/50 rounded-2xl p-1 backdrop-blur-sm overflow-x-auto max-w-full">
              <div className="flex items-center gap-0.5 sm:gap-1 min-w-max px-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-2 sm:px-3 lg:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
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
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-border/50 hover:bg-accent/20 transition-all duration-300 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">Plan de salle</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Plan de salle</DialogTitle>
                </DialogHeader>
                <img src={floorPlanImg} alt="Plan de salle Prince Palace" className="w-full h-auto rounded-lg" />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl border-border/50 hover:bg-accent/20 transition-all duration-300 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            >
              <Sun className="h-3 w-3 sm:h-4 sm:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3 w-3 sm:h-4 sm:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={signOut}
              className="rounded-xl border-border/50 hover:bg-destructive/20 hover:text-destructive transition-all duration-300 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
