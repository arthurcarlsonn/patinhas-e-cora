
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ProductCardProps } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const VerProdutos = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar produtos:', error);
          return;
        }

        if (data) {
          // Converter dados do banco para o formato do ProductCard
          const formattedProducts: ProductCardProps[] = data.map(product => ({
            id: product.id,
            title: product.title,
            image: product.main_image_url || `https://via.placeholder.com/300x200?text=Produto`,
            price: Number(product.price),
            category: product.category,
            location: product.location,
            views: product.views || 0,
            business: {
              id: product.user_id,
              name: 'Usuário', // Nome padrão já que não temos a relação com profiles
              verified: true
            },
            homeDelivery: product.home_delivery || false
          }));

          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5D23BE] uppercase mb-2">Todos os Produtos</h1>
            <p className="text-lg text-gray-600 mb-8">Encontre tudo o que seu pet precisa</p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum produto encontrado. Seja o primeiro a cadastrar!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerProdutos;
