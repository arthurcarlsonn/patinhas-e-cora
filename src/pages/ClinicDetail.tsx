
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import ClinicImage from '@/components/clinic-detail/ClinicImage';
import ClinicBasicInfo from '@/components/clinic-detail/ClinicBasicInfo';
import ClinicServices from '@/components/clinic-detail/ClinicServices';
import ClinicVeterinarios from '@/components/clinic-detail/ClinicVeterinarios';
import ClinicContact from '@/components/clinic-detail/ClinicContact';
import ClinicActions from '@/components/clinic-detail/ClinicActions';
import ClinicNotFound from '@/components/clinic-detail/ClinicNotFound';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Veterinario {
  nome: string;
  especialidade: string;
}

interface ClinicData {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  description: string;
  services: string[];
  specialties: string[];
  open_hours: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  social_media: { instagram?: string; facebook?: string };
  has_parking: boolean;
  has_home_service: boolean;
  main_image_url: string;
  views: number;
  veterinarios: Veterinario[];
}

const ClinicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<ClinicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchClinic = async () => {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Buscar dados da clínica
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', id)
          .single();

        if (clinicError) {
          console.error('Erro ao buscar clínica:', clinicError);
          setNotFound(true);
          return;
        }

        if (!clinicData) {
          setNotFound(true);
          return;
        }

        // Incrementar visualizações
        const { error: updateError } = await supabase
          .from('clinics')
          .update({ views: (clinicData.views || 0) + 1 })
          .eq('id', id);

        if (updateError) {
          console.error('Erro ao atualizar visualizações:', updateError);
        }

        // Buscar veterinários da clínica
        const { data: vetsData, error: vetsError } = await supabase
          .from('veterinarians')
          .select('*')
          .eq('clinic_id', id);

        if (vetsError) {
          console.error('Erro ao buscar veterinários:', vetsError);
        }

        // Converter os dados dos veterinários
        const veterinarios: Veterinario[] = (vetsData || []).map(vet => ({
          nome: vet.name,
          especialidade: vet.specialty
        }));

        // Montar objeto da clínica completo
        const formattedClinic: ClinicData = {
          ...clinicData,
          veterinarios,
          services: clinicData.services || [],
          specialties: clinicData.specialties || [],
          social_media: clinicData.social_media || { instagram: '', facebook: '' },
          views: (clinicData.views || 0) + 1  // Atualizar localmente para exibição imediata
        };

        setClinic(formattedClinic);
      } catch (error) {
        console.error('Erro ao buscar detalhes da clínica:', error);
        toast.error('Erro ao carregar os detalhes da clínica. Por favor, tente novamente.');
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinic();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Skeleton className="h-64 md:h-full" />
                </div>
                <div className="md:w-1/2 p-6">
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !clinic) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <ClinicNotFound />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Imagem */}
              <div className="md:w-1/2">
                <ClinicImage 
                  image={clinic.main_image_url}
                  name={clinic.name}
                  category={clinic.category}
                />
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <ClinicBasicInfo 
                  name={clinic.name}
                  endereco={clinic.address || `Endereço não informado - ${clinic.location}`}
                  horarioFuncionamento={clinic.open_hours || "Horário não informado"}
                  views={clinic.views}
                  atendimentoDomicilio={clinic.has_home_service}
                  possuiEstacionamento={clinic.has_parking}
                  description={clinic.description || `${clinic.name} é uma clínica veterinária em ${clinic.location}.`}
                />

                <ClinicServices 
                  servicos={clinic.services}
                  especialidades={clinic.specialties}
                />

                <ClinicVeterinarios 
                  veterinarios={clinic.veterinarios}
                />
                
                <ClinicContact 
                  telefone={clinic.phone || "Não informado"}
                  whatsapp={clinic.whatsapp || "Não informado"}
                  email={clinic.email || "Não informado"}
                  website={clinic.website || "#"}
                  socialMedia={clinic.social_media}
                />
                
                <ClinicActions />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClinicDetail;
