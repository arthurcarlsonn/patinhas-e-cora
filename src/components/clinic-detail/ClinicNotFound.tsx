
import React from 'react';
import { Button } from '@/components/ui/button';

const ClinicNotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800">Clínica não encontrada</h1>
      <p className="mt-2 text-gray-600">A clínica que você está procurando não existe ou foi removida.</p>
      <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
    </div>
  );
};

export default ClinicNotFound;
