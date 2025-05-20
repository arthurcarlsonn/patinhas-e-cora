
import React from 'react';
import EventCard, { EventCardProps } from './EventCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventListProps {
  title: string;
  events: EventCardProps[];
  viewAllLink: string;
}

const EventList = ({ title, events, viewAllLink }: EventListProps) => {
  return (
    <section className="py-12 bg-pet-softGray">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple">{title}</h2>
          <Link to={viewAllLink}>
            <Button variant="link" className="text-pet-purple hover:text-pet-lightPurple">
              Ver todos
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventList;
