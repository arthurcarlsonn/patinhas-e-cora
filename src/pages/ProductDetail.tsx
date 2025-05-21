
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Eye, Phone, Mail, Share2, Tag, Truck, MessageCircle, Globe, Facebook, Instagram } from 'lucide-react';
import { shareContent } from '@/utils/shareUtils';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  contact: string;
  main_image_url?: string;
  website?: string;
  views: number;
  user_id: string;
  social_media?: Record<string, string>;
  home_delivery: boolean;
  created_at: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar produto:', error);
          setNotFound(true);
          return;
        }

        if (data) {
          setProduct(data as Product);

          // Increment view count
          await supabase
            .from('products')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);

          // Fetch product additional images
          const { data: imagesData, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', id);

          if (!imagesError && imagesData) {
            setImages(imagesData as ProductImage[]);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleShare = () => {
    if (product) {
      shareContent(
        product.title,
        `Confira este produto: ${product.title} - ${formattedPrice(product.price)}`,
        window.location.href
      );
    }
  };

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!id || notFound) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
            <p className="mt-2 text-gray-600">O produto que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pet-purple border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                    src={product?.main_image_url || ''}
                    alt={product?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${product?.title}`;
                    }}
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-800 border border-blue-200">
                    {product?.category}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{product?.title}</h1>
                </div>
                
                <div className="mt-4 flex items-center">
                  <Tag size={18} className="text-[#5D23BE] mr-2" />
                  <span className="text-2xl font-bold text-[#5D23BE]">
                    {product && formattedPrice(product.price)}
                  </span>
                </div>
                
                {product?.home_delivery && (
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center">
                      <Truck size={14} className="mr-1" />
                      Entrega a domicílio disponível
                    </Badge>
                  </div>
                )}
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{product?.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{product?.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-gray-600">
                    {product?.description}
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
                      <p className="font-medium text-gray-800">Vendedor</p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1" />
                          <span>{product?.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Site e redes sociais */}
                {(product?.website || (product?.social_media && Object.keys(product.social_media).length > 0)) && (
                  <div className="mt-4">
                    <div className="space-y-2">
                      {product?.website && (
                        <div className="flex items-center text-gray-600">
                          <Globe size={14} className="mr-2" />
                          <a href={product.website.startsWith('http') ? product.website : `https://${product.website}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="text-[#5D23BE] hover:underline">
                            {product.website}
                          </a>
                        </div>
                      )}
                      
                      {product?.social_media && (
                        <div className="flex space-x-4">
                          {product.social_media.instagram && (
                            <div className="flex items-center text-gray-600">
                              <Instagram size={14} className="mr-1 text-pink-600" />
                              <span>{product.social_media.instagram}</span>
                            </div>
                          )}
                          {product.social_media.facebook && (
                            <div className="flex items-center text-gray-600">
                              <Facebook size={14} className="mr-1 text-blue-600" />
                              <span>{product.social_media.facebook}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button className="bg-pet-purple hover:bg-pet-lightPurple">Comprar Agora</Button>
                  <Button variant="outline" className="flex items-center">
                    <MessageCircle size={16} className="mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="flex items-center" onClick={handleShare}>
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>

            {/* Imagens adicionais */}
            {images && images.length > 0 && (
              <div className="p-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Mais Imagens</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square">
                      <img 
                        src={img.image_url} 
                        alt={`${product?.title} - imagem adicional`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
