
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PetImageProps {
  image: string;
  name: string;
  status: 'perdido' | 'encontrado' | 'adocao';
}

const statusColors = {
  perdido: 'bg-red-100 text-red-800 border-red-200',
  encontrado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  adocao: 'bg-green-100 text-green-800 border-green-200',
};

const statusLabels = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Para Adoção',
};

const PetImage = ({ image, name, status }: PetImageProps) => {
  return (
    <div className="h-64 md:h-full bg-gray-300 relative">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/600x400?text=${name}`;
        }}
      />
      <Badge 
        className={`absolute top-4 right-4 ${statusColors[status]} border`}
      >
        {statusLabels[status]}
      </Badge>
    </div>
  );
};

export { statusColors, statusLabels };
export default PetImage;
