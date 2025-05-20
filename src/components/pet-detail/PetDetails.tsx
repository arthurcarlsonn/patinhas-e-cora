
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Eye, PawPrint, Ruler, Baby, Users } from 'lucide-react';

interface PetDetailsProps {
  pet: {
    name: string;
    type: string;
    location: string;
    timeRegistered: string;
    views: number;
    raca?: string;
    idade?: string;
    genero?: 'Macho' | 'Fêmea';
    porte?: string;
    status: 'perdido' | 'encontrado' | 'adocao';
    castrado?: boolean;
    vacinasEmDia?: boolean;
    aceitaCriancas?: boolean;
    aceitaOutrosAnimais?: boolean;
    descricao?: string;
    temperamento?: string;
  };
}

const PetDetails = ({ pet }: PetDetailsProps) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
        <Badge variant="outline">{pet.type}</Badge>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin size={18} className="mr-2" />
          <span>{pet.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock size={18} className="mr-2" />
          <span>{pet.timeRegistered}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Eye size={18} className="mr-2" />
          <span>{pet.views} visualizações</span>
        </div>
      </div>
      
      {/* Detalhes do Pet */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {pet.raca && (
          <div className="flex items-center text-gray-700">
            <PawPrint size={16} className="mr-2 text-pet-purple" />
            <span>Raça: {pet.raca}</span>
          </div>
        )}
        {pet.idade && (
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-2 text-pet-purple" />
            <span>Idade: {pet.idade}</span>
          </div>
        )}
        {pet.genero && (
          <div className="flex items-center text-gray-700">
            {pet.genero === 'Macho' ? (
              <div className="flex items-center">
                <span className="mr-2 text-blue-500 text-lg">♂</span>
                <span>Macho</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2 text-pink-500 text-lg">♀</span>
                <span>Fêmea</span>
              </div>
            )}
          </div>
        )}
        {pet.porte && (
          <div className="flex items-center text-gray-700">
            <Ruler size={16} className="mr-2 text-pet-purple" />
            <span>Porte: {pet.porte}</span>
          </div>
        )}
      </div>
      
      {/* Status extras */}
      {pet.status === 'adocao' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant={pet.castrado ? "default" : "outline"} className={pet.castrado ? "bg-green-100 text-green-800 border-green-200" : ""}>
            {pet.castrado ? "Castrado" : "Não castrado"}
          </Badge>
          <Badge variant={pet.vacinasEmDia ? "default" : "outline"} className={pet.vacinasEmDia ? "bg-green-100 text-green-800 border-green-200" : ""}>
            {pet.vacinasEmDia ? "Vacinas em dia" : "Vacinas pendentes"}
          </Badge>
          <Badge variant={pet.aceitaCriancas ? "default" : "outline"} className={pet.aceitaCriancas ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
            <Baby size={14} className="mr-1" />
            {pet.aceitaCriancas ? "Aceita crianças" : "Não aceita crianças"}
          </Badge>
          <Badge variant={pet.aceitaOutrosAnimais ? "default" : "outline"} className={pet.aceitaOutrosAnimais ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
            <Users size={14} className="mr-1" />
            {pet.aceitaOutrosAnimais ? "Aceita outros animais" : "Não aceita outros animais"}
          </Badge>
        </div>
      )}
      
      {/* Data desaparecimento para pets perdidos */}
      {pet.status === 'perdido' && (
        <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
          <p className="text-sm text-red-700 font-medium">
            <Clock size={14} className="inline-block mr-1" />
            Desaparecido desde: {pet.timeRegistered}
          </p>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Descrição</h2>
        <p className="text-gray-600">
          {pet.descricao || "Sem descrição disponível."}
        </p>
      </div>

      {/* Temperamento para adoção */}
      {pet.status === 'adocao' && pet.temperamento && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-800">Temperamento</h3>
          <p className="text-gray-600">{pet.temperamento}</p>
        </div>
      )}
    </>
  );
};

export default PetDetails;
