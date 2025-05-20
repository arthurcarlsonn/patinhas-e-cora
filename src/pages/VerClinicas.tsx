
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClinicCard from '@/components/ClinicCard';
import { ClinicCardProps } from '@/components/ClinicCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { clinicsMock } from '@/data/mockData';

const VerClinicas = () => {
  const [clinics, setClinics] = useState<ClinicCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        // Temporarily using mock data as the clinics table is not created yet
        // When the clinics table is created, uncomment the code below and remove the mock data
        /*
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar clínicas:', error);
          return;
        }

        if (data) {
          // Convert data from database to ClinicCard format
          const formattedClinics: ClinicCardProps[] = data.map(clinic => ({
            id: clinic.id,
            name: clinic.name,
            image: clinic.image_url || `https://via.placeholder.com/300x200?text=Clínica`,
            location: clinic.location,
            category: clinic.speciality,
            contactInfo: {
              phone: clinic.phone,
              email: clinic.email,
              website: clinic.website || ''
            },
            rating: clinic.rating || 0,
            views: clinic.views || 0
          }));

          setClinics(formattedClinics);
        }
        */
        
        // Using mock data for now
        setClinics(clinicsMock);
      } catch (error) {
        console.error('Erro ao buscar clínicas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5D23BE] uppercase mb-2">Todas as Clínicas</h1>
            <p className="text-lg text-gray-600 mb-8">Encontre clínicas e veterinários para seu pet</p>
            
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
            ) : clinics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {clinics.map((clinic) => (
                  <ClinicCard key={clinic.id} {...clinic} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma clínica encontrada. Seja o primeiro a cadastrar!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerClinicas;
