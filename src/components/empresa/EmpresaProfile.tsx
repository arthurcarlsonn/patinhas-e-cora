import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Building, Mail, Phone, Globe, Instagram, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmpresaProfileProps {
  company: {
    name: string;
    email: string;
    cnpj: string;
    phone: string;
    logo: string;
    address: string;
    website: string;
    socialMedia: {
      instagram: string;
      facebook: string;
    };
    description: string;
  };
  isLoading?: boolean;
  updateCompany?: (updatedCompany: any) => Promise<void>;
}

const EmpresaProfile = ({ company, isLoading = false, updateCompany }: EmpresaProfileProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [companyData, setCompanyData] = useState(company);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (updateCompany) {
      try {
        await updateCompany(companyData);
        setEditMode(false);
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar as informações da empresa.",
          variant: "destructive",
        });
      }
    } else {
      setEditMode(false);
      toast({
        title: "Perfil atualizado!",
        description: "As informações da sua empresa foram atualizadas com sucesso.",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Perfil da Empresa</h2>
        {!editMode && !isLoading && (
          <Button 
            onClick={() => setEditMode(true)}
            className="bg-pet-purple hover:bg-pet-lightPurple"
          >
            Editar Perfil
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pet-purple"></div>
        </div>
      ) : editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={companyData.logo} alt={companyData.name} />
              <AvatarFallback><Building /></AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Alterar Logo</Button>
          </div>
          
          <div>
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input 
              id="company-name" 
              value={companyData.name}
              onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="company-cnpj">CNPJ</Label>
            <Input 
              id="company-cnpj" 
              value={companyData.cnpj}
              onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="company-email">E-mail</Label>
            <Input 
              id="company-email" 
              type="email"
              value={companyData.email}
              onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="company-phone">Telefone</Label>
            <Input 
              id="company-phone" 
              value={companyData.phone}
              onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="company-address">Endereço</Label>
            <Input 
              id="company-address" 
              value={companyData.address}
              onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="company-website">Website</Label>
            <Input 
              id="company-website" 
              value={companyData.website}
              onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="company-instagram">Instagram</Label>
            <Input 
              id="company-instagram" 
              value={companyData.socialMedia.instagram}
              onChange={(e) => setCompanyData({
                ...companyData, 
                socialMedia: {...companyData.socialMedia, instagram: e.target.value}
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="company-facebook">Facebook</Label>
            <Input 
              id="company-facebook" 
              value={companyData.socialMedia.facebook}
              onChange={(e) => setCompanyData({
                ...companyData, 
                socialMedia: {...companyData.socialMedia, facebook: e.target.value}
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="company-description">Descrição</Label>
            <Textarea 
              id="company-description" 
              value={companyData.description}
              onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
              rows={4}
              required 
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="submit" 
              className="flex-1 bg-pet-purple hover:bg-pet-lightPurple"
              disabled={isLoading}
            >
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditMode(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={companyData.logo} alt={companyData.name} />
              <AvatarFallback><Building /></AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{companyData.name}</h3>
            <p className="text-gray-500">{companyData.cnpj}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-gray-600">{companyData.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-gray-600">{companyData.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">Endereço</p>
                <p className="text-gray-600">{companyData.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">Website</p>
                <p className="text-gray-600">{companyData.website}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Instagram className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-gray-600">{companyData.socialMedia.instagram}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Facebook className="h-5 w-5 text-pet-purple mt-0.5" />
              <div>
                <p className="font-medium">Facebook</p>
                <p className="text-gray-600">{companyData.socialMedia.facebook}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="font-medium">Descrição</p>
              <p className="text-gray-600 mt-1">{companyData.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaProfile;
