import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Layout/Header";
import { DashboardSection } from "@/components/Dashboard/DashboardSection";
import { LinksSection } from "@/components/Links/LinksSection";
import { ReservationsSection } from "@/components/Reservations/ReservationsSection";
import { DataSection } from "@/components/Data/DataSection";
import { IntegrationsSection } from "@/components/Integrations/IntegrationsSection";
import { AssistantSection } from "@/components/Assistant/AssistantSection";
import { useAuth } from "@/hooks/useAuth";

function IndexContent() {
  const { role } = useAuth();
  const isServeur = role === "serveur";
  const [activeTab, setActiveTab] = useState(isServeur ? "reservations" : "dashboard");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // If serveur tries to access non-reservations tab, redirect
  useEffect(() => {
    if (isServeur && activeTab !== "reservations") {
      setActiveTab("reservations");
    }
  }, [isServeur, activeTab]);

  const renderActiveSection = () => {
    if (isServeur) return <ReservationsSection />;
    switch (activeTab) {
      case "dashboard":
        return <DashboardSection />;
      case "links":
        return <LinksSection />;
      case "reservations":
        return <ReservationsSection />;
      case "data":
        return <DataSection />;
      case "assistant":
        return <AssistantSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8">
        {renderActiveSection()}
      </main>
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
