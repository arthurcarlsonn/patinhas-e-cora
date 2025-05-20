
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileTabProps {
  isLoading: boolean;
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
  };
  setUser: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
  }>>;
}

const ProfileTab = ({ isLoading, user, setUser }: ProfileTabProps) => {
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, aqui seria feito o envio dos dados para o backend
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatar">Foto de Perfil</Label>
              <div className="mt-2 flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  Alterar foto
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})} 
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})} 
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={user.phone} 
                onChange={(e) => setUser({...user, phone: e.target.value})} 
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Sobre mim</Label>
              <Textarea 
                id="bio" 
                rows={4} 
                value={user.bio} 
                onChange={(e) => setUser({...user, bio: e.target.value})} 
              />
            </div>
          </div>
          
          <Button type="submit" variant="purple">
            Salvar Alterações
          </Button>
        </form>
      )}
    </div>
  );
};

export default ProfileTab;
