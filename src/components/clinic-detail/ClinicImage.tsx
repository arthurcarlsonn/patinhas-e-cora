
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ClinicImageProps {
  image: string;
  name: string;
  category: string;
}

const ClinicImage = ({ image, name, category }: ClinicImageProps) => {
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
      <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-800 border border-blue-200">
        {category}
      </Badge>
    </div>
  );
};

export default ClinicImage;
