
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface PetContactProps {
  contactWhatsapp?: string;
  name: string;
  status: 'perdido' | 'encontrado' | 'adocao';
  location: string;
}

const PetContact = ({ contactWhatsapp, name, status, location }: PetContactProps) => {
  const statusLabels = {
    perdido: 'Perdido',
    encontrado: 'Encontrado',
    adocao: 'Para Adoção',
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Contato</h2>
      <div className="flex items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Usuário" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-medium text-gray-800">Cadastrado por</p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
            {contactWhatsapp && (
              <div className="flex items-center">
                <Phone size={14} className="mr-1" />
                <span>{contactWhatsapp}</span>
              </div>
            )}
            <div className="flex items-center mt-1 sm:mt-0">
              <Mail size={14} className="mr-1" />
              <span>Contato via site</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-3">
        {contactWhatsapp && (
          <Button 
            variant="purple"
            onClick={() => window.open(`https://wa.me/${contactWhatsapp.replace(/\D/g, '')}`, '_blank')}
          >
            Contatar via WhatsApp
          </Button>
        )}
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => {
            const url = window.location.href;
            const text = `${statusLabels[status]}: ${name} - ${status}`;
            navigator.share?.({
              title: text,
              text: `${text} em ${location}`,
              url: url,
            }).catch(console.error);
          }}
        >
          <Share2 size={16} className="mr-2" />
          Compartilhar
        </Button>
      </div>
    </>
  );
};

export default PetContact;
