
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OngSidebar from '@/components/ong-dashboard/OngSidebar';
import OngProfile from '@/components/ong-dashboard/OngProfile';
import OngForm from '@/components/anunciar/OngForm';
import OngEventForm from '@/components/ong-dashboard/OngEventForm';
import OngEventList from '@/components/ong-dashboard/OngEventList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const OngDashboard = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [organization, setOrganization] = useState<{ id: string; name: string; image: string } | null>(null);
  const { user, loading, userType } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionar se não estiver logado ou não for uma ONG
    if (!loading && (!user || userType !== 'ngo')) {
      navigate('/entrar');
    }
  }, [user, loading, navigate, userType]);

  useEffect(() => {
    if (!user) return;

    // Buscar dados da ONG do usuário
    const fetchOngData = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, main_image_url')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar dados da ONG:', error);
          return;
        }

        if (data) {
          setOrganization({
            id: data.id,
            name: data.name,
            image: data.main_image_url || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados da ONG:', error);
      }
    };

    fetchOngData();
  }, [user]);

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-pet-softGray">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirecionar se não estiver logado
  if (!user) {
    return null; // O useEffect acima redirecionará
  }

  // Renderizar conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <OngProfile />;
      case 'cadastro':
        return (
          <>
            {organization ? (
              <Alert className="mb-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você já tem uma ONG cadastrada. Use a aba "Perfil da ONG" para editar suas informações.
                </AlertDescription>
              </Alert>
            ) : null}
            <OngForm onSubmit={() => {
              // Recarregar a página após o cadastro para atualizar os dados
              window.location.reload();
            }} />
          </>
        );
      case 'novo-evento':
        return <OngEventForm />;
      case 'eventos':
        return <OngEventList />;
      default:
        return <OngProfile />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-pet-softGray py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-pet-darkPurple">Dashboard ONG/Voluntário</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <OngSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                organization={organization}
              />
            </div>
            
            {/* Conteúdo principal */}
            <div className="md:col-span-2">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OngDashboard;
