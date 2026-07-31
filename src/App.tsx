import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingPage } from "./pages/BookingPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Le tunnel de réservation reste dans le bundle principal (chargement instantané).
// Tout le reste est chargé à la demande.
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EmailPreviewPage = lazy(() => import("./pages/EmailPreviewPage"));
const ThankYouEmailPreviewPage = lazy(() => import("./pages/ThankYouEmailPreviewPage"));
const ModifyReservationPage = lazy(() => import("./pages/ModifyReservationPage"));
const CancelReservationPage = lazy(() => import("./pages/CancelReservationPage"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground">
    Chargement...
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <RouteFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <RouteFallback />;
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
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/book/:slug" element={<BookingPage />} />
              <Route path="/reservation/modify/:token" element={<ModifyReservationPage />} />
              <Route path="/reservation/cancel/:token" element={<CancelReservationPage />} />
              <Route path="/email-preview" element={<EmailPreviewPage />} />
              <Route path="/email-preview-thankyou" element={<ThankYouEmailPreviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Toaster>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
