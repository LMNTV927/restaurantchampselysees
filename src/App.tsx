import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { BookingPage } from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import EmailPreviewPage from "./pages/EmailPreviewPage";
import ThankYouEmailPreviewPage from "./pages/ThankYouEmailPreviewPage";
import ModifyReservationPage from "./pages/ModifyReservationPage";
import CancelReservationPage from "./pages/CancelReservationPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  if (user) return <Navigate to="/" replace />;
  return <LoginPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/reservation/modify/:token" element={<ModifyReservationPage />} />
            <Route path="/reservation/cancel/:token" element={<CancelReservationPage />} />
            <Route path="/email-preview" element={<EmailPreviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
