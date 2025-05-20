
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-12 bg-[#9b87f5] relative overflow-hidden">
      {/* Patinhas de fundo */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-10 h-10 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-white">
              <path d="M48.8,12.5c3.3-6.4,8.5-10.8,13.1-9.8c4.6,1,5.7,7,2.4,13.4c-3.3,6.4-8.5,10.8-13.1,9.8 C46.6,24.9,45.5,18.9,48.8,12.5z"/>
              <path d="M71.8,27.5c3.3-6.4,8.5-10.8,13.1-9.8c4.6,1,5.7,7,2.4,13.4c-3.3,6.4-8.5,10.8-13.1,9.8 C69.6,39.9,68.5,33.9,71.8,27.5z"/>
              <path d="M28.7,30.2c3.3-6.4,8.5-10.8,13.1-9.8c4.6,1,5.7,7,2.4,13.4c-3.3,6.4-8.5,10.8-13.1,9.8 C26.6,42.6,25.4,36.6,28.7,30.2z"/>
              <path d="M15.2,55.2c3.3-6.4,8.5-10.8,13.1-9.8c4.6,1,5.7,7,2.4,13.4c-3.3,6.4-8.5,10.8-13.1,9.8 C13,67.6,11.9,61.6,15.2,55.2z"/>
              <path d="M34,90c0-7.2,3.3-13,7.5-13s7.5,5.8,7.5,13c0,7.2-3.3,13-7.5,13S34,97.2,34,90z"/>
              <path d="M51,90c0-7.2,3.3-13,7.5-13s7.5,5.8,7.5,13c0,7.2-3.3,13-7.5,13S51,97.2,51,90z"/>
              <path d="M68,90c0-7.2,3.3-13,7.5-13s7.5,5.8,7.5,13c0,7.2-3.3,13-7.5,13S68,97.2,68,90z"/>
              <path d="M85,90c0-7.2,3.3-13,7.5-13s7.5,5.8,7.5,13c0,7.2-3.3,13-7.5,13S85,97.2,85,90z"/>
            </svg>
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in text-white md:text-6xl">
              Conectando corações e patinhas
            </h1>
            <p 
              style={{
                animationDelay: "0.2s"
              }} 
              className="text-xl mb-8 animate-fade-in text-slate-50"
            >
              Ajudamos a encontrar pets perdidos e a dar um lar para aqueles que precisam de uma família.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cadastrar-pet">
                <Button 
                  style={{
                    animationDelay: "0.4s"
                  }} 
                  className="px-6 py-2 transition-all animate-fade-in text-white text-2xl font-light rounded-3xl bg-[#70d07e] hover:bg-[#5db369] border-none shadow-md"
                >
                  Cadastrar Pet
                </Button>
              </Link>
              <Link to="/buscar-pets">
                <Button 
                  variant="outline" 
                  style={{
                    animationDelay: "0.6s"
                  }} 
                  className="border-white/30 font-medium px-6 py-2 flex items-center gap-2 transition-all animate-fade-in text-white rounded-full text-left text-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  <Search size={18} />
                  Buscar Pets
                </Button>
              </Link>
            </div>
          </div>
          <div 
            className="md:w-1/2 flex justify-center md:justify-end animate-fade-in relative" 
            style={{
              animationDelay: "0.8s"
            }}
          >
            <div className="animate-float">
              <img 
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e" 
                alt="Cachorro e gato juntos" 
                className="rounded-2xl shadow-xl max-w-full h-auto object-cover" 
                style={{
                  maxHeight: '400px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
