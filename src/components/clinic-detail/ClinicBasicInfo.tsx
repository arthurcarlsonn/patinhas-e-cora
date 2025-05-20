
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Eye } from 'lucide-react';

interface ClinicBasicInfoProps {
  name: string;
  endereco: string;
  horarioFuncionamento: string;
  views: number;
  atendimentoDomicilio: boolean;
  possuiEstacionamento: boolean;
  description: string;
}

const ClinicBasicInfo = ({ 
  name, 
  endereco, 
  horarioFuncionamento, 
  views, 
  atendimentoDomicilio, 
  possuiEstacionamento,
  description 
}: ClinicBasicInfoProps) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin size={18} className="mr-2" />
          <span>{endereco}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock size={18} className="mr-2" />
          <span>{horarioFuncionamento}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Eye size={18} className="mr-2" />
          <span>{views} visualizações</span>
        </div>
      </div>
      
      <div className="mt-4">
        {atendimentoDomicilio && (
          <Badge className="bg-green-100 text-green-800 border-green-200 mr-2">
            Atendimento a domicílio
          </Badge>
        )}
        {possuiEstacionamento && (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Estacionamento
          </Badge>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Sobre a Clínica</h2>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </>
  );
};

export default ClinicBasicInfo;
