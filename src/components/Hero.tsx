import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
const Hero = () => {
  return <section className="py-12 bg-[#a181ae]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in text-white md:text-6xl">
              Conectando corações e patinhas
            </h1>
            <p style={{
            animationDelay: "0.2s"
          }} className="text-xl mb-8 animate-fade-in text-slate-50">
              Ajudamos a encontrar pets perdidos e a dar um lar para aqueles que precisam de uma família.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cadastrar-pet">
                <Button style={{
                animationDelay: "0.4s"
              }} className="bg-pet-softGreen hover:bg-green-400 px-6 py-2 transition-all animate-fade-in text-white text-2xl font-light rounded-3xl">
                  Cadastrar Pet
                </Button>
              </Link>
              <Link to="/buscar-pets">
                <Button variant="outline" style={{
                animationDelay: "0.6s"
              }} className="border-gray-400 font-medium px-6 py-2 flex items-center gap-2 transition-all animate-fade-in text-white rounded-full text-left text-2xl bg-white/0">
                  <Search size={18} />
                  Buscar Pets
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end animate-fade-in" style={{
          animationDelay: "0.8s"
        }}>
            <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e" alt="Cachorro e gato juntos" className="rounded-lg shadow-lg max-w-full h-auto object-cover" style={{
            maxHeight: '400px'
          }} />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;