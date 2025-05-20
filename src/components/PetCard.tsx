
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PetCardProps {
  id: string;
  name: string;
  type: string;
  status: 'perdido' | 'encontrado' | 'adocao';
  image: string;
  location: string;
  timeRegistered: string;
  views: number;
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

const PetCard = ({ id, name, type, status, image, location, timeRegistered, views }: PetCardProps) => {
  return (
    <Link to={`/pet/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-scale h-full">
        <div className="relative h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=${type}`;
            }}
          />
          <Badge 
            className={`absolute top-2 right-2 ${statusColors[status]} border`}
          >
            {statusLabels[status]}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{name}</h3>
            <Badge variant="outline">{type}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{timeRegistered}</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 text-sm text-gray-500">
          <div className="flex items-center">
            <Eye size={14} className="mr-1" />
            <span>{views} visualizações</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PetCard;
