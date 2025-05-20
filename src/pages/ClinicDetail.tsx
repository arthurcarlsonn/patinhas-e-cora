
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clinicsMock } from '@/data/mockData';
import { MapPin, Eye, Phone, Mail, Share2, Clock, Calendar } from 'lucide-react';

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
                  <Badge className="absolute top-4 right-4 bg-teal-100 text-teal-800 border border-teal-200">
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
                    <span>{clinic.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>Segunda a Sexta: 08:00 - 18:00 | Sábado: 08:00 - 12:00</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{clinic.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Sobre a Clínica</h2>
                  <p className="text-gray-600">
                    {/* Simulação de descrição, em produção viria do banco de dados */}
                    {clinic.name} oferece serviços veterinários de alta qualidade com profissionais especializados.
                    Contamos com equipamentos modernos e instalações confortáveis para garantir o melhor atendimento para o seu pet.
                    {clinic.category === 'Hospital' && " Atendimento 24 horas para emergências veterinárias."}
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Serviços</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Consultas</Badge>
                    <Badge variant="outline">Vacinas</Badge>
                    <Badge variant="outline">Exames</Badge>
                    <Badge variant="outline">Cirurgias</Badge>
                    {clinic.category === 'Hospital' && <Badge variant="outline">Emergência 24h</Badge>}
                    <Badge variant="outline">Banho & Tosa</Badge>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>(11) 3456-7890</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span>contato@{clinic.name.toLowerCase().replace(/\s/g, '')}.com.br</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple" className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button variant="outline">Entrar em Contato</Button>
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
