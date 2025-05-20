
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Building } from 'lucide-react';
import { shareContent } from '@/utils/shareUtils';

interface EventActionsProps {
  eventTitle: string;
  eventLocation: string;
  organization?: {
    id: string;
    name: string;
  };
}

const EventActions = ({ eventTitle, eventLocation, organization }: EventActionsProps) => {
  const handleShare = () => {
    const url = window.location.href;
    shareContent(
      eventTitle,
      `Confira o evento ${eventTitle} em ${eventLocation}`,
      url
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default" className="bg-pet-purple hover:bg-pet-lightPurple">
        Confirmar presença
      </Button>
      <Button variant="outline" className="flex items-center" onClick={handleShare}>
        <Share2 size={16} className="mr-2" />
        Compartilhar
      </Button>
      {organization && (
        <Button variant="outline" className="flex items-center" asChild>
          <a href={`/ong/${organization.id}`}>
            <Building size={16} className="mr-2" />
            Conhecer a organização
          </a>
        </Button>
      )}
    </div>
  );
};

export default EventActions;
