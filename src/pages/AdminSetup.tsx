import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function AdminSetup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking admin:', error);
        return;
      }

      setAdminExists(data && data.length > 0);
    } catch (error) {
      console.error('Error checking admin:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminExists) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      // Create the admin user
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (error) {
        toast({
          title: "Erreur de création",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update the user role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', formData.email);

      if (updateError) {
        console.error('Error updating role:', updateError);
        toast({
          title: "Avertissement",
          description: "Compte créé mais rôle admin non assigné. Contactez le support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Administrateur créé",
          description: "Le compte administrateur a été créé avec succès",
        });
        navigate('/auth');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Vérification...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
        <Card>
          <CardContent className="text-center p-6">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Administration déjà configurée
            </h2>
            <p className="text-muted-foreground mb-4">
              Un administrateur existe déjà. Connectez-vous pour accéder au système.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Aller à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-playfair text-foreground">
              Configuration initiale
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Créez le premier compte administrateur
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Nom complet
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Votre nom complet"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email administrateur
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@restaurant.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 caractères
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer le compte administrateur'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}