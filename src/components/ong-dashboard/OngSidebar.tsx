
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Settings, CalendarPlus, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OngSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organization?: {
    name: string;
    image: string;
  } | null;
}

const OngSidebar = ({ activeTab, setActiveTab, organization }: OngSidebarProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage 
            src={organization?.image || ''}
            alt={organization?.name || user?.email || 'ONG'} 
          />
          <AvatarFallback>
            {organization?.name?.charAt(0) || user?.email?.charAt(0) || 'O'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{organization?.name || 'Sua ONG'}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>
      
      <nav className="space-y-2">
        <Button 
          variant={activeTab === 'perfil' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('perfil')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Perfil da ONG
        </Button>
        <Button 
          variant={activeTab === 'cadastro' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('cadastro')}
        >
          <Heart className="mr-2 h-4 w-4" />
          Cadastrar ONG
        </Button>
        <Button 
          variant={activeTab === 'eventos' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('eventos')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Meus Eventos
        </Button>
        <Button 
          variant={activeTab === 'novo-evento' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('novo-evento')}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </nav>
    </div>
  );
};

export default OngSidebar;
