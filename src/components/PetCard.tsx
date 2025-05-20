
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

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
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Favorited pet: ${name}`);
    // In a real app, this would save to user favorites
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Shared pet: ${name}`);
    // In a real app, this would open share dialog
  };

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
        
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Eye size={14} className="mr-1" />
            <span>{views} visualizações</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8"
              onClick={handleFavorite}
            >
              <Heart size={16} className="text-gray-500 hover:text-red-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8"
              onClick={handleShare}
            >
              <Share2 size={16} className="text-gray-500 hover:text-blue-500" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PetCard;
