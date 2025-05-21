import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Store, Settings, LogOut, Building } from 'lucide-react';
import ProductManagement from '@/components/empresa/ProductManagement';
import ClinicManagement from '@/components/empresa/ClinicManagement';
import EmpresaProfile from '@/components/empresa/EmpresaProfile';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCardProps } from '@/components/ProductCard';
import { ClinicCardProps } from '@/components/ClinicCard';

const EmpresaDashboard = () => {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('produtos');
  const [company, setCompany] = useState({
    name: "",
    email: "",
    cnpj: "",
    phone: "",
    logo: "https://github.com/shadcn.png",
    address: "",
    website: "",
    socialMedia: {
      instagram: "",
      facebook: ""
    },
    description: ""
  });

  const [companyProducts, setCompanyProducts] = useState<ProductCardProps[]>([]);
  const [companyClinics, setCompanyClinics] = useState<ClinicCardProps[]>([]);
  
  // Verificar se o usuário está logado como empresa
  useEffect(() => {
    if (!user) {
      navigate('/empresas');
      return;
    }
    
    if (userType !== 'company') {
      navigate('/dashboard');
      return;
    }
    
    // Carregar dados da empresa
    const fetchCompanyData = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCompany({
            name: data.company_name || '',
            email: data.email || user.email || '',
            cnpj: data.cnpj || '',
            phone: data.phone || '',
            logo: data.logo_url || 'https://github.com/shadcn.png',
            address: data.address || '',
            website: data.website || '',
            socialMedia: {
              instagram: '',
              facebook: ''
            },
            description: data.description || ''
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados da empresa:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados da sua empresa.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Carregar produtos da empresa
    const fetchCompanyProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          // Converter dados do banco para o formato do ProductCard
          const formattedProducts: ProductCardProps[] = data.map(product => ({
            id: product.id,
            title: product.title,
            image: product.main_image_url || `https://via.placeholder.com/300x200?text=Produto`,
            price: Number(product.price),
            category: product.category,
            location: product.location,
            views: product.views || 0,
            business: {
              id: product.user_id,
              name: company.name || 'Empresa',
              verified: true
            },
            homeDelivery: product.home_delivery || false
          }));
          
          setCompanyProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };
    
    // Carregar clínicas da empresa
    const fetchCompanyClinics = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          // Converter dados do banco para o formato do ClinicCard
          const formattedClinics: ClinicCardProps[] = data.map(clinic => ({
            id: clinic.id,
            name: clinic.name,
            image: clinic.main_image_url || `https://via.placeholder.com/300x200?text=Clínica`,
            location: clinic.location,
            category: clinic.category,
            views: clinic.views || 0
          }));
          
          setCompanyClinics(formattedClinics);
        }
      } catch (error) {
        console.error('Erro ao carregar clínicas:', error);
      }
    };
    
    fetchCompanyData();
    fetchCompanyProducts();
    fetchCompanyClinics();
  }, [user, navigate, userType, toast]);
  
  // Atualizar perfil da empresa
  const updateCompany = async (updatedCompany: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: updatedCompany.name,
          email: updatedCompany.email,
          phone: updatedCompany.phone,
          address: updatedCompany.address,
          website: updatedCompany.website,
          description: updatedCompany.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setCompany(updatedCompany);
      toast({
        title: 'Sucesso',
        description: 'Os dados da sua empresa foram atualizados com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar dados da empresa:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os dados da sua empresa.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pet-purple flex items-center justify-center text-white">
                  <Store size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  <p className="text-gray-600">{company.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => signOut()}
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="produtos" className="flex gap-2 items-center">
                  <Package size={16} />
                  Meus Produtos
                </TabsTrigger>
                <TabsTrigger value="clinicas" className="flex gap-2 items-center">
                  <Building size={16} />
                  Minhas Clínicas
                </TabsTrigger>
                <TabsTrigger value="perfil" className="flex gap-2 items-center">
                  <Settings size={16} />
                  Perfil da Empresa
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="produtos">
                <ProductManagement 
                  companyId={user?.id || ''}
                />
              </TabsContent>
              
              <TabsContent value="clinicas">
                <ClinicManagement 
                  companyId={user?.id || ''}
                />
              </TabsContent>
              
              <TabsContent value="perfil">
                <EmpresaProfile 
                  company={company}
                  isLoading={isLoading}
                  updateCompany={updateCompany}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmpresaDashboard;
