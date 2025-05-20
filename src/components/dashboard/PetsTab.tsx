
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  type: string;
  image: string;
  views: number;
}

interface PetsTabProps {
  isLoading: boolean;
  userPets: Pet[];
}

const PetsTab = ({ isLoading, userPets }: PetsTabProps) => {
  const navigate = useNavigate();

  const handleDeletePet = (petId: string) => {
    // Em produção, aqui seria feito o envio da requisição de exclusão para o backend
    alert(`Pet ${petId} deletado com sucesso!`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Pets</h1>
        <Button 
          variant="purple" 
          onClick={() => navigate('/cadastrar-pet')}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Pet
        </Button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <div className="flex p-4">
                <Skeleton className="w-24 h-24 sm:w-36 sm:h-36" />
                <div className="flex-1 ml-4 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </div>
            </Card>
          ))
        ) : userPets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Você ainda não cadastrou nenhum pet.</p>
            <Button 
              variant="purple" 
              onClick={() => navigate('/cadastrar-pet')}
            >
              Cadastrar meu primeiro pet
            </Button>
          </div>
        ) : (
          userPets.map(pet => (
            <Card key={pet.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-24 h-24 sm:w-36 sm:h-36">
                  <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/300x200?text=${pet.name}`;
                    }}
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.type}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Eye size={14} className="mr-1" />
                        <span>{pet.views} visualizações</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/pet/${pet.id}/edit`)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePet(pet.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link to={`/pet/${pet.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PetsTab;
