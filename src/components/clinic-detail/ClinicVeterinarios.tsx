
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Veterinario {
  nome: string;
  especialidade: string;
}

interface ClinicVeterinariosProps {
  veterinarios: Veterinario[];
}

const ClinicVeterinarios = ({ veterinarios }: ClinicVeterinariosProps) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-800 mb-3">Veterinários</h3>
      <div className="space-y-3">
        {veterinarios.map((vet, index) => (
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
  );
};

export default ClinicVeterinarios;
