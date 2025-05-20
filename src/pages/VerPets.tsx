
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PetCard from '@/components/PetCard';
import { petsMock } from '@/data/mockData';

const VerPets = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5D23BE] uppercase mb-2">Todos os Pets</h1>
            <p className="text-lg text-gray-600 mb-8">Encontre o pet ideal para você</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {petsMock.map((pet) => (
                <PetCard key={pet.id} {...pet} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerPets;
