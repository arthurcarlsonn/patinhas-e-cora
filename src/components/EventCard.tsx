
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <Link to={`/evento/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-scale h-full">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x200?text=Evento`;
            }}
          />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{title}</h3>
            <Badge variant="outline">{category}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
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

export default EventCard;
