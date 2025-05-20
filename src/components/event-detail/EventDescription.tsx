
import React from 'react';

interface EventDescriptionProps {
  description: string;
}

const EventDescription = ({ description }: EventDescriptionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Sobre o evento</h2>
      <div className="text-gray-700 whitespace-pre-line">
        {description}
      </div>
    </div>
  );
};

export default EventDescription;
