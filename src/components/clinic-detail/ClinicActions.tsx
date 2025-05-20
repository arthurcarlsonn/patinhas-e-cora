
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, FileText, Share2 } from 'lucide-react';

const ClinicActions = () => {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button variant="purple" className="flex items-center">
        <Calendar size={16} className="mr-2" />
        Agendar Consulta
      </Button>
      <Button variant="outline" className="flex items-center">
        <MessageCircle size={16} className="mr-2" />
        Enviar Mensagem
      </Button>
      <Button variant="outline" className="flex items-center">
        <FileText size={16} className="mr-2" />
        Ver Documentos
      </Button>
      <Button variant="outline" className="flex items-center">
        <Share2 size={16} className="mr-2" />
        Compartilhar
      </Button>
    </div>
  );
};

export default ClinicActions;
