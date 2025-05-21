
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ClinicEditForm from './ClinicEditForm';

interface ClinicCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
}

interface ClinicManagementProps {
  companyId: string;
}

const ClinicManagement = ({ companyId }: ClinicManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [clinics, setClinics] = useState<ClinicCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClinicFormOpen, setIsClinicFormOpen] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, [companyId]);

  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedClinics: ClinicCardProps[] = data.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          category: clinic.category,
          location: clinic.location,
          image: clinic.main_image_url || '/placeholder.svg'
        }));
        
        setClinics(formattedClinics);
      }
    } catch (error: any) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Erro ao carregar clínicas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClinic = async () => {
    if (!selectedClinic) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', selectedClinic);

      if (error) throw error;

      // Update local state
      setClinics(clinics.filter(c => c.id !== selectedClinic));
      
      toast({
        title: "Clínica excluída",
        description: "A clínica foi excluída com sucesso."
      });
      
    } catch (error: any) {
      console.error('Error deleting clinic:', error);
      toast({
        title: "Erro ao excluir clínica",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedClinic(null);
    }
  };

  const handleClinicFormClose = () => {
    setIsClinicFormOpen(false);
  };

  const handleClinicFormSuccess = () => {
    setIsClinicFormOpen(false);
    fetchClinics();
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    setSelectedClinic(null);
    fetchClinics();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suas Clínicas</h2>
        <Button 
          variant="default" 
          className="bg-pet-purple hover:bg-pet-lightPurple"
          onClick={() => setIsClinicFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Clínica
        </Button>
      </div>

      {clinics.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma clínica cadastrada</h3>
            <p className="text-muted-foreground mb-6">Adicione sua primeira clínica para começar a atender.</p>
            <Button 
              variant="default" 
              className="bg-pet-purple hover:bg-pet-lightPurple"
              onClick={() => setIsClinicFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Clínica
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/300x200?text=Clínica`;
                  }}
                />
                <div className="absolute top-0 left-0 right-0 p-4">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="bg-white hover:bg-gray-100 h-8 w-8"
                      onClick={() => {
                        setSelectedClinic(clinic.id);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="bg-white hover:bg-red-100 text-red-500 hover:text-red-600 h-8 w-8"
                      onClick={() => {
                        setSelectedClinic(clinic.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{clinic.name}</h3>
                <p className="text-sm text-gray-500">{clinic.category}</p>
                <p className="text-sm text-gray-500">{clinic.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form modal for adding a new clinic */}
      <Dialog open={isClinicFormOpen} onOpenChange={setIsClinicFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Clínica</DialogTitle>
          </DialogHeader>
          {/* Placeholder for EmpresaClinicForm component */}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Clínica</DialogTitle>
          </DialogHeader>
          {selectedClinic && (
            <ClinicEditForm
              clinicId={selectedClinic}
              onCancel={() => setIsEditing(false)}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A clínica será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClinic}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClinicManagement;
