
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { clinicsMock } from '@/data/mockData';
import { MapPin, Clock, Eye, Phone, Mail, Share2, Globe, Calendar, FileText, MessageCircle, Instagram, Facebook } from 'lucide-react';

const ClinicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const clinic = clinicsMock.find(clinic => clinic.id === id);

  if (!clinic) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Clínica não encontrada</h1>
            <p className="mt-2 text-gray-600">A clínica que você está procurando não existe ou foi removida.</p>
            <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
          </div>
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
                <div className="h-64 md:h-full bg-gray-300 relative">
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${clinic.name}`;
                    }}
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-800 border border-blue-200">
                    {clinic.category}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{clinic.name}</h1>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{enhancedClinic.endereco}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>{enhancedClinic.horarioFuncionamento}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{clinic.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  {enhancedClinic.atendimentoDomicilio && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 mr-2">
                      Atendimento a domicílio
                    </Badge>
                  )}
                  {enhancedClinic.possuiEstacionamento && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Estacionamento
                    </Badge>
                  )}
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Sobre a Clínica</h2>
                  <p className="text-gray-600">
                    {enhancedClinic.description}
                  </p>
                </div>

                {/* Serviços */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">Serviços</h3>
                  <div className="flex flex-wrap gap-2">
                    {enhancedClinic.servicos.map((servico, index) => (
                      <Badge key={index} variant="outline">
                        {servico}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Especialidades */}
                <div className="mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {enhancedClinic.especialidades.map((especialidade, index) => (
                      <Badge key={index} variant="outline" className="border-pet-purple text-pet-purple">
                        {especialidade}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Veterinários */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-3">Veterinários</h3>
                  <div className="space-y-3">
                    {enhancedClinic.veterinarios.map((vet, index) => (
                      <div key={index} className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{vet.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{vet.nome}</p>
                          <p className="text-sm text-gray-600">{vet.especialidade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>{enhancedClinic.telefone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>{enhancedClinic.whatsapp} (WhatsApp)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span>{enhancedClinic.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe size={16} className="mr-2" />
                      <a href="#" className="text-[#5D23BE] hover:underline">{enhancedClinic.website}</a>
                    </div>
                  </div>
                </div>

                {/* Redes sociais */}
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Instagram size={16} className="mr-1 text-pink-600" />
                      <span>{enhancedClinic.socialMedia.instagram}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Facebook size={16} className="mr-1 text-blue-600" />
                      <span>{enhancedClinic.socialMedia.facebook}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple" className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <MessageCircle size={16} className="mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FileText size={16} className="mr-2" />
                    Ver Documentos
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
                </div>
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
