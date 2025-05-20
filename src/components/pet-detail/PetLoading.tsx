
import React from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PetLoadingProps {
  isLoading: boolean;
  petExists: boolean;
  goBack: () => void;
}

const PetLoading = ({ isLoading, petExists, goBack }: PetLoadingProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pet-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando informações do pet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!petExists) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Pet não encontrado</h1>
            <p className="mt-2 text-gray-600">O pet que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" variant="purple" onClick={goBack}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
};

export default PetLoading;
