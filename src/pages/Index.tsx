
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

// Importar dados mockados
import { 
  petsMock, 
  productsMock, 
  organizationsMock,
  eventsMock,
  clinicsMock 
} from '@/data/mockData';

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
          pets={petsMock} 
          viewAllLink="/pets"
        />
        <ProductList 
          title="Produtos para seu Pet" 
          products={productsMock} 
          viewAllLink="/produtos"
        />
        <OrgList 
          title="ONGs e Voluntários" 
          organizations={organizationsMock} 
          viewAllLink="/ongs"
        />
        <EventList 
          title="Eventos" 
          events={eventsMock} 
          viewAllLink="/eventos"
        />
        <ClinicList 
          title="Clínicas e Veterinários" 
          clinics={clinicsMock} 
          viewAllLink="/clinicas"
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
