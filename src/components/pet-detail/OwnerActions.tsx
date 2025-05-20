
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OwnerActionsProps {
  petId: string;
  userId: string;
}

const OwnerActions = ({ petId, userId }: OwnerActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEdit = () => {
    navigate(`/pet/${petId}/edit`);
  };

  const handleDelete = async () => {
    if (!petId || !userId) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Pet removido",
        description: "O pet foi removido com sucesso",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao remover pet:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao remover o pet",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4 flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        onClick={handleEdit}
      >
        <Edit size={16} className="mr-2" />
        Editar
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Excluir
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Sim, excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerActions;
