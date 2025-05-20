
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { eventsMock } from '@/data/mockData';

const VerEventos = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-[#4e049c]">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">Todos os Eventos</h1>
            <p className="text-lg text-white/80 mb-8">Confira os próximos eventos para pets</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {eventsMock.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerEventos;
