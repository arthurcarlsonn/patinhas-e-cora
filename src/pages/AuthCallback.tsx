
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a slight delay to ensure auth state is updated
    const redirectTimer = setTimeout(() => {
      if (user) {
        // Redirect based on user type
        if (userType === 'personal') {
          navigate('/dashboard');
        } else if (userType === 'company') {
          navigate('/empresa/dashboard');
        } else if (userType === 'ngo') {
          navigate('/ong/dashboard');
        } else {
          navigate('/dashboard'); // Default fallback
        }
      } else {
        // If no user, redirect to login
        navigate('/entrar');
      }
    }, 1500); // Give time for auth state to update
    
    return () => clearTimeout(redirectTimer);
  }, [user, userType, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 text-pet-purple animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Autenticando...</h2>
      <p className="text-gray-600">Por favor, aguarde enquanto finalizamos o processo de login.</p>
    </div>
  );
};

export default AuthCallback;
