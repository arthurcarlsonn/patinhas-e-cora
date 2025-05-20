
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Eye, Heart } from 'lucide-react';

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ user, activeTab, setActiveTab }: DashboardSidebarProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
      
      <nav className="space-y-2">
        <Button 
          variant={activeTab === 'perfil' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('perfil')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Meu Perfil
        </Button>
        <Button 
          variant={activeTab === 'pets' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('pets')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Meus Pets
        </Button>
        <Button 
          variant={activeTab === 'favoritos' ? 'purple' : 'outline'} 
          className="w-full justify-start"
          onClick={() => setActiveTab('favoritos')}
        >
          <Heart className="mr-2 h-4 w-4" />
          Meus Favoritos
        </Button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
