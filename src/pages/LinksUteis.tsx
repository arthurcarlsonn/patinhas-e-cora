
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Link as LinkIcon } from 'lucide-react';

const LinksUteis = () => {
  const linkCategories = [
    {
      title: 'ONGs e Abrigos',
      links: [
        { name: 'Abrigo Esperança Animal', url: 'https://exemplo.org/esperancaanimal', description: 'ONG dedicada ao resgate e reabilitação de animais abandonados.' },
        { name: 'Patinhas Carentes', url: 'https://exemplo.org/patinhascarentes', description: 'Abrigo que cuida de cães e gatos até encontrarem um novo lar.' },
        { name: 'Amigos dos Animais', url: 'https://exemplo.org/amigosdosanimais', description: 'Grupo de voluntários que trabalham com adoção responsável.' }
      ]
    },
    {
      title: 'Saúde Animal',
      links: [
        { name: 'Hospital Veterinário Popular', url: 'https://exemplo.org/hospitalveterinario', description: 'Atendimento veterinário a preços acessíveis.' },
        { name: 'Clínica Bem-Estar Pet', url: 'https://exemplo.org/bemestar', description: 'Atendimento especializado para cães e gatos.' },
        { name: 'Centro de Zoonoses', url: 'https://exemplo.org/zoonoses', description: 'Informações sobre vacinação e controle de zoonoses.' }
      ]
    },
    {
      title: 'Educação e Comportamento',
      links: [
        { name: 'Escola Canina', url: 'https://exemplo.org/escolacanina', description: 'Dicas de adestramento positivo e comportamento animal.' },
        { name: 'Felinos & Companhia', url: 'https://exemplo.org/felinos', description: 'Blog sobre comportamento e cuidados com gatos.' },
        { name: 'Academia Pet', url: 'https://exemplo.org/academiapet', description: 'Cursos online sobre cuidados básicos com animais de estimação.' }
      ]
    },
    {
      title: 'Legislação e Direitos Animais',
      links: [
        { name: 'Legislação Animal', url: 'https://exemplo.org/legislacao', description: 'Portal com informações sobre leis de proteção animal.' },
        { name: 'Direitos dos Pets', url: 'https://exemplo.org/direitospets', description: 'Informações sobre direitos dos animais e como denunciar maus-tratos.' },
        { name: 'Proteção Animal', url: 'https://exemplo.org/protecaoanimal', description: 'Orientações para denúncias e procedimentos legais.' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-pet-purple text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Links Úteis</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Selecionamos os melhores recursos e informações para ajudar você a cuidar do seu pet 
              e contribuir com a causa animal.
            </p>
          </div>
        </section>

        {/* Alerta Informativo */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-start rounded-lg">
              <Info className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-blue-800">Importante</h3>
                <p className="text-blue-700">
                  Os links abaixo são fornecidos como referência e não representam necessariamente um endosso 
                  do PetFinder a essas organizações. Verifique sempre a reputação dos serviços antes de utilizá-los.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Links por Categoria */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {linkCategories.map((category, index) => (
                <div key={index}>
                  <div className="mb-6">
                    <Badge className="bg-pet-purple mb-2">{category.title}</Badge>
                    <h2 className="text-2xl font-bold text-pet-darkPurple">{category.title}</h2>
                    <div className="h-1 w-24 bg-pet-purple rounded my-4"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.links.map((link, linkIndex) => (
                      <Card key={linkIndex} className="border-none hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-3">
                            <LinkIcon className="text-pet-purple mr-2" size={18} />
                            <h3 className="text-lg font-semibold text-pet-darkPurple">{link.name}</h3>
                          </div>
                          <p className="text-gray-600 mb-4">{link.description}</p>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-pet-purple hover:text-pet-lightPurple font-medium flex items-center"
                          >
                            Visitar Site
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sugestões */}
        <section className="py-12 bg-pet-softGray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple mb-6">Conhece algum recurso útil?</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Se você conhece algum link ou recurso que possa ser útil para nossa comunidade,
              por favor nos envie para que possamos compartilhar com todos.
            </p>
            <Link 
              to="/contato" 
              className="bg-pet-purple hover:bg-pet-lightPurple text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              Sugerir Link
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LinksUteis;
