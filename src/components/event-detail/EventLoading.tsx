
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const EventLoading = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-6">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventLoading;
