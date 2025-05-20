
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock, Heart, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { shareContent } from '@/utils/shareUtils';

export interface PetCardProps {
  id: string;
  name: string;
  type: string;
  status: 'perdido' | 'encontrado' | 'adocao';
  image: string;
  location: string;
  timeRegistered: string;
  views: number;
  // Extended fields (these would come from the database in a real app)
  raca?: string;
  idade?: string;
  genero?: 'Macho' | 'Fêmea';
  porte?: 'Pequeno' | 'Médio' | 'Grande';
  cor?: string;
  temperamento?: string;
  castrado?: boolean;
  vacinasEmDia?: boolean;
  aceitaCriancas?: boolean;
  aceitaOutrosAnimais?: boolean;
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

const PetCard = ({ 
  id, 
  name, 
  type, 
  status, 
  image, 
  location, 
  timeRegistered, 
  views,
  raca, 
  idade,
  genero,
  porte
}: PetCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites: ${name}`);
    
    // In a real app with Supabase integration, we would save this to the user's favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const petFavorites = favorites.pets || [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = petFavorites.filter((petId: string) => petId !== id);
      favorites.pets = updatedFavorites;
    } else {
      // Add to favorites if not already there
      if (!petFavorites.includes(id)) {
        favorites.pets = [...petFavorites, id];
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/pet/${id}`;
    const statusText = statusLabels[status];
    shareContent(
      `Pet ${statusText}: ${name}`,
      `${name} - ${type} - ${statusText} em ${location}`,
      url
    );
  };

  // Modificar para navegar diretamente para a página de detalhes
  const handleCardClick = () => {
    navigate(`/pet/${id}`);
  };

  // Check if pet is in favorites on component mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const petFavorites = favorites.pets || [];
    if (petFavorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [id]);

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-102 h-full cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
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
        
        {/* Add gender badge if available */}
        {genero && (
          <Badge 
            className="absolute bottom-2 right-2 bg-white/80 text-gray-700 border border-gray-300"
          >
            {genero === 'Macho' ? 
              <span className="text-blue-500">♂</span> : 
              <span className="text-pink-500">♀</span>
            }
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{name}</h3>
          <Badge variant="outline">{type}</Badge>
        </div>
        {(raca || porte) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {raca && <span className="text-xs text-gray-600">{raca}</span>}
            {raca && porte && <span className="text-xs text-gray-400 mx-1">•</span>}
            {porte && <span className="text-xs text-gray-600">Porte {porte}</span>}
          </div>
        )}
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
        {idade && (
          <div className="mt-1 text-sm text-gray-500">
            Idade: {idade}
          </div>
        )}
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
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"} 
            />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-8 w-8"
            onClick={handleShare}
            aria-label="Compartilhar"
          >
            <Share2 size={16} className="text-gray-500 hover:text-blue-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
