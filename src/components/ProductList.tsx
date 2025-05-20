
import React from 'react';
import ProductCard, { ProductCardProps } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductListProps {
  title: string;
  products: ProductCardProps[];
  viewAllLink: string;
}

const ProductList = ({ title, products, viewAllLink }: ProductListProps) => {
  return (
    <section className="py-12 bg-pet-softGray">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-pet-darkPurple">{title}</h2>
          <Link to={viewAllLink}>
            <Button variant="link" className="text-pet-purple hover:text-pet-lightPurple">
              Ver todos
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
