
import React from 'react';
import OrgCard, { OrgCardProps } from './OrgCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrgListProps {
  title: string;
  organizations: OrgCardProps[];
  viewAllLink: string;
}

const OrgList = ({ title, organizations, viewAllLink }: OrgListProps) => {
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
          {organizations.map((org) => (
            <OrgCard key={org.id} {...org} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgList;
