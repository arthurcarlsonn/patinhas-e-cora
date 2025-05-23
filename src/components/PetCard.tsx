
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Heart, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { shareContent } from '@/utils/shareUtils';

export interface PetCardProps {
  id: string;
  name: string;
  type: string;
  status: 'perdido' | 'encontrado' | 'adocao' | 'avistado';
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
  avistado: 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusLabels = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Para Adoção',
  avistado: 'Avistado',
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

  // Handle card click - navigate to the pet detail page
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
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="relative w-full h-48">
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
      </div>
      
      <div className="bg-gray-100 p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="bg-white">{type}</Badge>
          {raca && <Badge variant="outline" className="bg-white">{raca}</Badge>}
          {porte && <Badge variant="outline" className="bg-white">Porte {porte}</Badge>}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <MapPin size={16} className="mr-1 text-pet-purple" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <Eye size={16} className="mr-1 text-pet-purple" />
            <span>{views} visualizações</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8 hover:bg-transparent"
              onClick={handleFavorite}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart 
                size={18} 
                className={isFavorite ? "text-red-500 fill-red-500" : "text-pet-purple hover:text-red-500"} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8 hover:bg-transparent"
              onClick={handleShare}
              aria-label="Compartilhar"
            >
              <Share2 size={18} className="text-pet-purple hover:text-blue-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PetCard;
