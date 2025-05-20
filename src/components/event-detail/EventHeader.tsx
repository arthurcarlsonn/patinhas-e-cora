
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventHeaderProps {
  title: string;
  category: string;
  imageUrl?: string;
  organization?: {
    id: string;
    name: string;
  };
}

const EventHeader = ({ title, category, imageUrl, organization }: EventHeaderProps) => {
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      adocao: 'Adoção',
      castracao: 'Castração',
      feira: 'Feira',
      vacinacao: 'Vacinação',
      arrecadacao: 'Arrecadação',
      educacao: 'Educação',
      outro: 'Outro'
    };
    
    return categories[category] || category;
  };

  return (
    <>
      <div className="h-64 bg-gray-300 relative">
        <img
          src={imageUrl || `https://via.placeholder.com/1200x400?text=${title}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
            {getCategoryName(category)}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {organization && (
            <div className="flex items-center mt-2">
              <Building size={16} className="text-gray-600 mr-2" />
              <Link 
                to={`/ong/${organization.id}`} 
                className="text-pet-purple hover:underline"
              >
                {organization.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventHeader;
