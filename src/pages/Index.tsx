import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Layout/Header";
import { DashboardSection } from "@/components/Dashboard/DashboardSection";
import { LinksSection } from "@/components/Links/LinksSection";
import { ReservationsSection } from "@/components/Reservations/ReservationsSection";
import { DataSection } from "@/components/Data/DataSection";

function IndexContent() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardSection />;
      case "links":
        return <LinksSection />;
      case "reservations":
        return <ReservationsSection />;
      case "data":
        return <DataSection />;
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