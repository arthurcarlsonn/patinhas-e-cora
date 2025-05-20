
import React, { useEffect, useState } from 'react';
import ProductCard, { ProductCardProps } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  title: string;
  products?: ProductCardProps[];
  viewAllLink: string;
  useMockData?: boolean;
  limit?: number;
  category?: string;
}

const ProductList = ({
  title,
  products: initialProducts,
  viewAllLink,
  useMockData = false,
  limit = 8,
  category
}: ProductListProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!useMockData);

  useEffect(() => {
    if (useMockData && initialProducts) {
      setProducts(initialProducts);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

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
            price: product.price,
            category: product.category,
            location: product.location,
            business: {
              id: product.user_id,
              name: 'Loja Pet', // Este nome seria buscado da tabela de empresas em um caso real
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
  }, [useMockData, initialProducts, limit, category]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5D23BE] uppercase">{title}</h2>
            <p className="text-sm md:text-base text-gray-600">Encontre tudo o que seu pet precisa em um só lugar</p>
          </div>
          <Link to={viewAllLink}>
            <Button variant="purple">
              Ver tudo
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(limit).fill(0).map((_, index) => (
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
            {products.map(product => <ProductCard key={product.id} {...product} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
