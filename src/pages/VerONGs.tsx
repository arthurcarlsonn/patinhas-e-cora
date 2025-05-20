
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrgCard from '@/components/OrgCard';
import { organizationsMock } from '@/data/mockData';

const VerONGs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-[#7900ff]">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">Todas as ONGs</h1>
            <p className="text-lg text-white/80 mb-8">Conheça ONGs e grupos de voluntários</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {organizationsMock.map((org) => (
                <OrgCard key={org.id} {...org} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerONGs;
