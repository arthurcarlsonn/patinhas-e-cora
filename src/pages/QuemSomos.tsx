
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const QuemSomos = () => {
  const team = [
    { 
      name: 'Ana Silva', 
      role: 'Fundadora & Diretora Executiva', 
      bio: 'Veterinária apaixonada por animais com mais de 10 anos de experiência em resgate e reabilitação.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    },
    { 
      name: 'Carlos Mendes', 
      role: 'Coordenador de Resgates', 
      bio: 'Especialista em comportamento animal dedicado ao bem-estar dos pets resgatados.',
      image: ''
    },
    { 
      name: 'Juliana Pereira', 
      role: 'Gerente de Adoção', 
      bio: 'Trabalha incansavelmente para encontrar o lar perfeito para cada pet.',
      image: ''
    },
    { 
      name: 'Roberto Gomes', 
      role: 'Desenvolvedor', 
      bio: 'Responsável pela plataforma que conecta pets e pessoas em todo o Brasil.',
      image: ''
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-pet-purple text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Quem Somos</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Somos uma equipe apaixonada por conectar corações e patinhas, 
              ajudando pets perdidos a encontrarem o caminho de volta para casa 
              e dando uma chance para animais abandonados encontrarem um novo lar.
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-pet-purple mb-4">Nossa História</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple mb-4">
                  Uma jornada de amor e dedicação
                </h2>
                <p className="text-gray-700 mb-4">
                  O PetFinder nasceu em 2019 da paixão de um grupo de amigos pelos animais. 
                  Após anos de trabalho voluntário em ONGs e abrigos, percebemos a necessidade 
                  de uma plataforma centralizada que pudesse conectar pets perdidos com seus donos 
                  e facilitar o processo de adoção responsável.
                </p>
                <p className="text-gray-700">
                  Desde então, já ajudamos mais de 5.000 pets a encontrarem o caminho de volta para casa 
                  e facilitamos a adoção de mais de 3.500 animais. Nossa missão é criar um mundo onde 
                  todos os pets tenham um lar amoroso e seguro.
                </p>
              </div>
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901" 
                  alt="Gato resgatado pelo PetFinder" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Missão e Valores */}
        <section className="py-12 bg-pet-softGray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-pet-purple mb-4">Nossa Missão</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple">
                O que nos motiva todos os dias
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pet-purple mb-4">Missão</h3>
                  <p className="text-gray-700">
                    Conectar pets perdidos com seus tutores e encontrar lares 
                    responsáveis para animais abandonados, promovendo o bem-estar animal.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pet-purple mb-4">Visão</h3>
                  <p className="text-gray-700">
                    Ser a principal plataforma de busca de pets perdidos e adoção 
                    responsável no Brasil, tornando o processo mais acessível e eficiente.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pet-purple mb-4">Valores</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Respeito pela vida animal</li>
                    <li>• Transparência nas ações</li>
                    <li>• Compromisso com adoção responsável</li>
                    <li>• Educação sobre cuidados com pets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-pet-purple mb-4">Nossa Equipe</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple">
                Conheça quem faz o PetFinder acontecer
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-pet-purple text-white text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-pet-darkPurple">{member.name}</h3>
                    <p className="text-pet-purple font-medium mb-2">{member.role}</p>
                    <p className="text-gray-700 text-center">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuemSomos;
