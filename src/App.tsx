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

// Site vitrine public
const SiteLayout = lazy(() => import("./components/Site/SiteLayout").then((m) => ({ default: m.SiteLayout })));
const Home = lazy(() => import("./pages/site/Home"));
const Evenementiel = lazy(() => import("./pages/site/Evenementiel"));
const Anniversaire = lazy(() => import("./pages/site/Anniversaire"));
const Afterwork = lazy(() => import("./pages/site/Afterwork"));
const Privatisation = lazy(() => import("./pages/site/Privatisation"));
const Evjf = lazy(() => import("./pages/site/Evjf"));
const SoireeEntreprise = lazy(() => import("./pages/site/SoireeEntreprise"));
const SeminaireEntreprise = lazy(() => import("./pages/site/SeminaireEntreprise"));
const RepasAffaires = lazy(() => import("./pages/site/RepasAffaires"));
const CocktailDinatoire = lazy(() => import("./pages/site/CocktailDinatoire"));
const DinerGroupe = lazy(() => import("./pages/site/DinerGroupe"));
const LancementProduit = lazy(() => import("./pages/site/LancementProduit"));
const TeamBuilding = lazy(() => import("./pages/site/TeamBuilding"));
const Restaurant = lazy(() => import("./pages/site/Restaurant"));
const Galerie = lazy(() => import("./pages/site/Galerie"));
const Avis = lazy(() => import("./pages/site/Avis"));
const Faq = lazy(() => import("./pages/site/Faq"));
const Contact = lazy(() => import("./pages/site/Contact"));
const MentionsLegales = lazy(() => import("./pages/site/MentionsLegales"));


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
  if (user) return <Navigate to="/dashboard" replace />;
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
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
<Route path="/evenementiel" element={<Evenementiel />} />
                <Route path="/anniversaire-restaurant-paris" element={<Anniversaire />} />
                <Route path="/afterwork-paris-champs-elysees" element={<Afterwork />} />
                <Route path="/privatisation-restaurant-paris" element={<Privatisation />} />
                <Route path="/evjf-paris-champs-elysees" element={<Evjf />} />
                <Route path="/soiree-entreprise-paris" element={<SoireeEntreprise />} />
                <Route path="/seminaire-entreprise-restaurant-paris" element={<SeminaireEntreprise />} />
                <Route path="/repas-affaires-restaurant-paris" element={<RepasAffaires />} />
                <Route path="/cocktail-dinatoire-paris" element={<CocktailDinatoire />} />
                <Route path="/diner-groupe-restaurant-paris" element={<DinerGroupe />} />
                <Route path="/lancement-produit-restaurant-paris" element={<LancementProduit />} />
                <Route path="/team-building-restaurant-paris" element={<TeamBuilding />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/galerie" element={<Galerie />} />
                <Route path="/avis" element={<Avis />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
              </Route>
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/book/:slug" element={<BookingPage />} />
              <Route path="/reservation/modify/:token" element={<ModifyReservationPage />} />
              <Route path="/reservation/cancel/:token" element={<CancelReservationPage />} />
              <Route path="/email-preview" element={<EmailPreviewPage />} />
              <Route path="/email-preview-thankyou" element={<ThankYouEmailPreviewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
