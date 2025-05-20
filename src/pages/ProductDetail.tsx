
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { productsMock } from '@/data/mockData';
import { MapPin, Eye, Phone, Mail, Share2, Tag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = productsMock.find(product => product.id === id);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
            <p className="mt-2 text-gray-600">O produto que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Imagem */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-300 relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${product.title}`;
                    }}
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-800 border border-blue-200">
                    {product.category}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
                </div>
                
                <div className="mt-4 flex items-center">
                  <Tag size={18} className="text-[#5D23BE] mr-2" />
                  <span className="text-2xl font-bold text-[#5D23BE]">{formattedPrice}</span>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{product.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{product.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-gray-600">
                    {/* Simulação de descrição, em produção viria do banco de dados */}
                    Este é um produto de alta qualidade da categoria {product.category}. 
                    Ideal para seu pet, com excelente custo-benefício.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Vendedor</h2>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Vendedor" />
                      <AvatarFallback>VN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">Vendedor da Silva</p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1" />
                          <span>(11) 98765-4321</span>
                        </div>
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Mail size={14} className="mr-1" />
                          <span>vendedor@email.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple">Comprar Agora</Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
