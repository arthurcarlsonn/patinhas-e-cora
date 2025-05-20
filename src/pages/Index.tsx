
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import SearchBar from '@/components/SearchBar';
import PetList from '@/components/PetList';
import ProductList from '@/components/ProductList';
import OrgList from '@/components/OrgList';
import EventList from '@/components/EventList';
import ClinicList from '@/components/ClinicList';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <SearchBar />
        <PetList 
          title="Últimos Pets Cadastrados" 
          viewAllLink="/pets"
          useMockData={false}
          limit={8}
        />
        <ProductList 
          title="Produtos para seu Pet" 
          viewAllLink="/produtos"
          useMockData={false}
          limit={8}
        />
        <OrgList 
          title="ONGs e Voluntários" 
          viewAllLink="/ongs"
          useMockData={false} 
          limit={8}
        />
        <EventList 
          title="Eventos" 
          viewAllLink="/eventos"
          limit={8}
        />
        <ClinicList 
          title="Clínicas e Veterinários" 
          viewAllLink="/clinicas"
          limit={8}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
