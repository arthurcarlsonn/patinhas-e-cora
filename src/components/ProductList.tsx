
import React from 'react';
import ProductCard, { ProductCardProps } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductListProps {
  title: string;
  products: ProductCardProps[];
  viewAllLink: string;
}

const ProductList = ({
  title,
  products,
  viewAllLink
}: ProductListProps) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
