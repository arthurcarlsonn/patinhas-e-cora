
import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventInfoProps {
  date: string;
  location: string;
}

const EventInfo = ({ date, location }: EventInfoProps) => {
  const eventDate = new Date(date);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="flex items-center bg-gray-50 p-4 rounded-lg">
        <Calendar size={24} className="text-pet-purple mr-3" />
        <div>
          <div className="text-sm text-gray-500">Data</div>
          <div className="font-medium">{format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
        </div>
      </div>
      
      <div className="flex items-center bg-gray-50 p-4 rounded-lg">
        <Clock size={24} className="text-pet-purple mr-3" />
        <div>
          <div className="text-sm text-gray-500">Horário</div>
          <div className="font-medium">{format(eventDate, "HH:mm", { locale: ptBR })}</div>
        </div>
      </div>
      
      <div className="flex items-center bg-gray-50 p-4 rounded-lg">
        <MapPin size={24} className="text-pet-purple mr-3" />
        <div>
          <div className="text-sm text-gray-500">Local</div>
          <div className="font-medium">{location}</div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
