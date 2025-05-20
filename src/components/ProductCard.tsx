
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  location: string;
  views: number;
}

const ProductCard = ({ id, title, category, image, price, location, views }: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Favorited product: ${title}`);
    // In a real app, this would save to user favorites
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Shared product: ${title}`);
    // In a real app, this would open share dialog
  };

  return (
    <Link to={`/produto/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-scale h-full">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=Produto`;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white font-bold">{formattedPrice}</p>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{title}</h3>
            <Badge variant="outline">{category}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
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

export default ProductCard;
