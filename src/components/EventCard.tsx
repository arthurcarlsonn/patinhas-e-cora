
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Calendar, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { shareContent } from '@/utils/shareUtils';

export interface EventCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  location: string;
  views: number;
}

const EventCard = ({ id, title, category, image, date, location, views }: EventCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    // In a real app with Supabase integration, we would save this to the user's favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const eventFavorites = favorites.events || [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = eventFavorites.filter((eventId: string) => eventId !== id);
      favorites.events = updatedFavorites;
    } else {
      // Add to favorites if not already there
      if (!eventFavorites.includes(id)) {
        favorites.events = [...eventFavorites, id];
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/evento/${id}`;
    shareContent(
      title,
      `Confira este evento: ${title} - ${date} em ${location}`,
      url
    );
  };

  // Check if event is in favorites on component mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const eventFavorites = favorites.events || [];
    if (eventFavorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [id]);

  return (
    <Link to={`/evento/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=Evento`;
            }}
          />
          <Badge 
            className="absolute top-2 right-2 bg-orange-100 text-orange-800 border-orange-200"
          >
            {category}
          </Badge>
        </div>
        
        <div className="bg-gray-100 p-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-1">{title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar size={16} className="mr-1 text-pet-purple" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
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

export default EventCard;
