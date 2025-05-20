
import React from 'react';
import ClinicCard, { ClinicCardProps } from './ClinicCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ClinicListProps {
  title: string;
  clinics: ClinicCardProps[];
  viewAllLink: string;
}

const ClinicList = ({ title, clinics, viewAllLink }: ClinicListProps) => {
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
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} {...clinic} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicList;
