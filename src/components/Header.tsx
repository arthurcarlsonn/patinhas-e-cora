
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  // Simula status de autenticação (em produção viria de um contexto de auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Simula usuário logado (em produção viria de um contexto de auth)
  const user = {
    name: 'Usuário',
    avatar: 'https://github.com/shadcn.png'
  };

  // Toggle para simular login/logout (remover em produção)
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/logo.svg" 
            alt="PetFinder Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/150x50?text=PetFinder";
            }}
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-pet-purple font-medium">
              Início
            </Link>
            <Link to="/quem-somos" className="text-gray-700 hover:text-pet-purple font-medium">
              Quem Somos
            </Link>
            <Link to="/links-uteis" className="text-gray-700 hover:text-pet-purple font-medium">
              Links Úteis
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/anunciar">
            <Button className="bg-pet-purple hover:bg-pet-lightPurple text-white font-medium rounded-full">
              Anunciar
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="outline" onClick={toggleAuth} className="border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white font-medium rounded-full">
                Sair
              </Button>
            </div>
          ) : (
            <Link to="/entrar">
              <Button 
                variant="outline" 
                onClick={toggleAuth} 
                className="border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white font-medium rounded-full"
              >
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
