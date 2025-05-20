
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { clinicsMock } from '@/data/mockData';
import ClinicImage from '@/components/clinic-detail/ClinicImage';
import ClinicBasicInfo from '@/components/clinic-detail/ClinicBasicInfo';
import ClinicServices from '@/components/clinic-detail/ClinicServices';
import ClinicVeterinarios from '@/components/clinic-detail/ClinicVeterinarios';
import ClinicContact from '@/components/clinic-detail/ClinicContact';
import ClinicActions from '@/components/clinic-detail/ClinicActions';
import ClinicNotFound from '@/components/clinic-detail/ClinicNotFound';

const ClinicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const clinic = clinicsMock.find(clinic => clinic.id === id);

  if (!clinic) {
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

  // Enhanced clinic data (in a real app, this would come from the database)
  const enhancedClinic = {
    ...clinic,
    description: `${clinic.name} é uma clínica veterinária completa. Oferecemos serviços de consultas, exames, cirurgias, vacinação e muito mais para garantir a saúde e bem-estar do seu pet.`,
    horarioFuncionamento: "Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h",
    servicos: [
      "Consultas",
      "Exames laboratoriais",
      "Cirurgias",
      "Vacinação",
      "Emergência 24h"
    ],
    especialidades: [
      "Dermatologia",
      "Cardiologia",
      "Ortopedia",
      "Odontologia"
    ],
    whatsapp: "(11) 98765-4321",
    telefone: "(11) 3456-7890",
    email: `contato@${clinic.name.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/gi, '')}.com.br`,
    website: `www.${clinic.name.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/gi, '')}.com.br`,
    socialMedia: {
      instagram: `@${clinic.name.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/gi, '')}`,
      facebook: `/${clinic.name.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/gi, '')}`
    },
    veterinarios: [
      { nome: "Dr. Carlos Silva", especialidade: "Clínico Geral" },
      { nome: "Dra. Ana Oliveira", especialidade: "Dermatologia" }
    ],
    endereco: `Rua das Flores, 123 - ${clinic.location}`,
    atendimentoDomicilio: Math.random() > 0.5,
    possuiEstacionamento: Math.random() > 0.5,
  };

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
                  image={clinic.image}
                  name={clinic.name}
                  category={clinic.category}
                />
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <ClinicBasicInfo 
                  name={clinic.name}
                  endereco={enhancedClinic.endereco}
                  horarioFuncionamento={enhancedClinic.horarioFuncionamento}
                  views={clinic.views}
                  atendimentoDomicilio={enhancedClinic.atendimentoDomicilio}
                  possuiEstacionamento={enhancedClinic.possuiEstacionamento}
                  description={enhancedClinic.description}
                />

                <ClinicServices 
                  servicos={enhancedClinic.servicos}
                  especialidades={enhancedClinic.especialidades}
                />

                <ClinicVeterinarios 
                  veterinarios={enhancedClinic.veterinarios}
                />
                
                <ClinicContact 
                  telefone={enhancedClinic.telefone}
                  whatsapp={enhancedClinic.whatsapp}
                  email={enhancedClinic.email}
                  website={enhancedClinic.website}
                  socialMedia={enhancedClinic.socialMedia}
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
