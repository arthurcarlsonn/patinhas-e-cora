
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const EventNotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Evento não encontrado</h1>
          <p className="mt-2 text-gray-600">O evento que você está procurando não existe ou foi removido.</p>
          <Button className="mt-4" variant="default" onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventNotFound;
