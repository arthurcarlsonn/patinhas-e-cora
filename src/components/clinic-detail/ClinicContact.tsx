
import React from 'react';
import { Phone, Mail, Globe, Instagram, Facebook } from 'lucide-react';

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
}

interface ClinicContactProps {
  telefone: string;
  whatsapp: string;
  email: string;
  website: string;
  socialMedia: SocialMedia;
}

const ClinicContact = ({ telefone, whatsapp, email, website, socialMedia }: ClinicContactProps) => {
  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Contato</h2>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-2" />
            <span>{telefone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-2" />
            <span>{whatsapp} (WhatsApp)</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-2" />
            <span>{email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Globe size={16} className="mr-2" />
            <a href="#" className="text-[#5D23BE] hover:underline">{website}</a>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex space-x-4">
          <div className="flex items-center text-gray-600">
            <Instagram size={16} className="mr-1 text-pink-600" />
            <span>{socialMedia.instagram || 'Não informado'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Facebook size={16} className="mr-1 text-blue-600" />
            <span>{socialMedia.facebook || 'Não informado'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicContact;
