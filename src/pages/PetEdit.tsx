
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PetEditForm from '@/components/dashboard/PetEditForm';

const PetEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/entrar');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-10 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-3xl">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <PetEditForm />
      <Footer />
    </>
  );
};

export default PetEdit;
