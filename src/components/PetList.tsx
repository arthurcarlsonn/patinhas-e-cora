
import React from 'react';
import PetCard, { PetCardProps } from './PetCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PetListProps {
  title: string;
  pets: PetCardProps[];
  viewAllLink: string;
}

const PetList = ({ title, pets, viewAllLink }: PetListProps) => {
  return (
    <section className="py-12 bg-white">
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
          {pets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetList;
