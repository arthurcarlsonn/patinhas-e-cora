
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Stats = () => {
  // Estes seriam os números que vêm do backend
  const stats = [
    { title: 'Pets Cadastrados', count: 1250 },
    { title: 'Pets Encontrados', count: 876 },
    { title: 'Pets Adotados', count: 534 }
  ];

  return (
    <section className="bg-pet-softGray py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover-scale">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <span className="text-4xl font-bold text-pet-purple mb-2">{stat.count}</span>
                <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
