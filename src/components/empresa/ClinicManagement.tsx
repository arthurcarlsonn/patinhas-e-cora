
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClinicCardProps } from '@/components/ClinicCard';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmpresaClinicForm from './EmpresaClinicForm';
import ClinicEditForm from './ClinicEditForm';

interface ClinicManagementProps {
  companyClinics: ClinicCardProps[];
  setCompanyClinics: (clinics: ClinicCardProps[]) => void;
}

const ClinicManagement = ({ companyClinics, setCompanyClinics }: ClinicManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedClinic, setSelectedClinic] = useState<ClinicCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClinic = async (clinicId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta clínica?")) return;
    
    setIsLoading(true);
    try {
      // First delete related veterinarians
      const { error: vetsError } = await supabase
        .from('veterinarians')
        .delete()
        .eq('clinic_id', clinicId);
      
      if (vetsError) throw vetsError;
      
      // Then delete the clinic
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId);
      
      if (error) throw error;
      
      // Update state to remove the deleted clinic
      setCompanyClinics(companyClinics.filter(clinic => clinic.id !== clinicId));
      
      toast({
        title: "Clínica excluída",
        description: "A clínica foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir clínica:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a clínica. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (clinic: ClinicCardProps) => {
    setSelectedClinic(clinic);
    setActiveTab('edit');
  };

  const handleEditComplete = (updatedClinic: ClinicCardProps) => {
    setCompanyClinics(
      companyClinics.map(c => c.id === updatedClinic.id ? updatedClinic : c)
    );
    setActiveTab('list');
    setSelectedClinic(null);
  };

  const handleCancelEdit = () => {
    setActiveTab('list');
    setSelectedClinic(null);
  };

  const refreshClinics = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        // Convert database data to ClinicCardProps format
        const formattedClinics: ClinicCardProps[] = data.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          image: clinic.main_image_url || `https://via.placeholder.com/300x200?text=Clínica`,
          location: clinic.location,
          category: clinic.category,
          views: clinic.views || 0
        }));
        
        setCompanyClinics(formattedClinics);
      }
    } catch (error) {
      console.error('Erro ao carregar clínicas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as clínicas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'add' | 'edit')}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Eye size={16} />
            Listar Clínicas
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar Clínica
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Minhas Clínicas</h2>
              <Button 
                variant="outline" 
                onClick={refreshClinics}
                disabled={isLoading}
              >
                Atualizar
              </Button>
            </div>
            
            {companyClinics.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyClinics.map(clinic => (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <img 
                          src={clinic.image} 
                          alt={clinic.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/300x200?text=Clínica`;
                          }}
                        />
                      </TableCell>
                      <TableCell>{clinic.name}</TableCell>
                      <TableCell>{clinic.category}</TableCell>
                      <TableCell>{clinic.location}</TableCell>
                      <TableCell>{clinic.views}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(clinic)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClinic(clinic.id)}
                            disabled={isLoading}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Link to={`/clinica/${clinic.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">Nenhuma clínica encontrada.</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar sua primeira clínica
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <EmpresaClinicForm 
            companyClinics={companyClinics}
            setCompanyClinics={setCompanyClinics}
            onSubmitSuccess={() => setActiveTab('list')}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          {selectedClinic && (
            <ClinicEditForm 
              clinic={selectedClinic}
              onCancel={handleCancelEdit}
              onUpdate={handleEditComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicManagement;
