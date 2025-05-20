
import React from 'react';
import OrgCard, { OrgCardProps } from './OrgCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrgListProps {
  title: string;
  organizations: OrgCardProps[];
  viewAllLink: string;
}

const OrgList = ({
  title,
  organizations,
  viewAllLink
}: OrgListProps) => {
  return (
    <section className="py-12 bg-[#7900ff]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">{title}</h2>
            <p className="text-sm md:text-base text-white/80">Encontre tudo o que seu pet precisa em um só lugar</p>
          </div>
          <Link to={viewAllLink}>
            <Button variant="purple" className="bg-white text-[#5D23BE] hover:bg-white/90">
              Ver tudo
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {organizations.map(org => <OrgCard key={org.id} {...org} />)}
        </div>
      </div>
    </section>
  );
};

export default OrgList;
