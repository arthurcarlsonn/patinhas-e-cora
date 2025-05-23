
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { shareContent } from '@/utils/shareUtils';

export interface ClinicCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  location: string;
  views: number;
}

const ClinicCard = ({ id, name, category, image, location, views }: ClinicCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    // In a real app with Supabase integration, we would save this to the user's favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const clinicFavorites = favorites.clinics || [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = clinicFavorites.filter((clinicId: string) => clinicId !== id);
      favorites.clinics = updatedFavorites;
    } else {
      // Add to favorites if not already there
      if (!clinicFavorites.includes(id)) {
        favorites.clinics = [...clinicFavorites, id];
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/clinica/${id}`;
    shareContent(
      name,
      `Confira esta clínica: ${name} em ${location}`,
      url
    );
  };

  // Check if clinic is in favorites on component mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const clinicFavorites = favorites.clinics || [];
    if (clinicFavorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [id]);

  return (
    <Link to={`/clinica/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=Clínica`;
            }}
          />
          <Badge 
            className="absolute top-2 right-2 bg-teal-100 text-teal-800 border-teal-200"
          >
            {category}
          </Badge>
        </div>
        
        <div className="bg-gray-100 p-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-1">{name}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin size={16} className="mr-1 text-pet-purple" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
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
    </Link>
  );
};

export default ClinicCard;
