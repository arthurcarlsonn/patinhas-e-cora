
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Heart, Share2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { shareContent } from '@/utils/shareUtils';

export interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  location: string;
  views: number;
  // Extended fields
  description?: string;
  atendimentoDomicilio?: boolean;
  vendedor?: {
    nome: string;
    telefone: string;
    email: string;
  };
  homeDelivery?: boolean;
  business?: {
    id: string;
    name: string;
    verified: boolean;
  };
}

const ProductCard = ({ 
  id, 
  title, 
  category, 
  image, 
  price, 
  location, 
  views,
  homeDelivery
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    // In a real app with Supabase integration, we would save this to the user's favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const productFavorites = favorites.products || [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = productFavorites.filter((productId: string) => productId !== id);
      favorites.products = updatedFavorites;
    } else {
      // Add to favorites if not already there
      if (!productFavorites.includes(id)) {
        favorites.products = [...productFavorites, id];
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/produto/${id}`;
    shareContent(
      title,
      `Confira este produto: ${title} - ${formattedPrice}`,
      url
    );
  };

  // Check if product is in favorites on component mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const productFavorites = favorites.products || [];
    if (productFavorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [id]);

  return (
    <Link to={`/produto/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=Produto`;
            }}
          />
          <Badge 
            className="absolute top-2 right-2 bg-blue-100 text-blue-800 border-blue-200"
          >
            {category}
          </Badge>
          
          {homeDelivery && (
            <Badge 
              className="absolute top-10 right-2 bg-green-100 text-green-800 border-green-200"
            >
              <Truck size={12} className="mr-1" />
              Entrega
            </Badge>
          )}
        </div>
        
        <div className="bg-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <span className="font-bold text-pet-purple">{formattedPrice}</span>
          </div>
          
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

export default ProductCard;
