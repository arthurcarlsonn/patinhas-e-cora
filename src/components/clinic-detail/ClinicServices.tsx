
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ClinicServicesProps {
  servicos: string[];
  especialidades: string[];
}

const ClinicServices = ({ servicos, especialidades }: ClinicServicesProps) => {
  return (
    <>
      <div className="mt-6">
        <h3 className="font-medium text-gray-800 mb-2">Serviços</h3>
        <div className="flex flex-wrap gap-2">
          {servicos.map((servico, index) => (
            <Badge key={index} variant="outline">
              {servico}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-medium text-gray-800 mb-2">Especialidades</h3>
        <div className="flex flex-wrap gap-2">
          {especialidades.map((especialidade, index) => (
            <Badge key={index} variant="outline" className="border-pet-purple text-pet-purple">
              {especialidade}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClinicServices;
