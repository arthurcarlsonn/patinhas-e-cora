
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Loader2, Edit, Trash2, Share2 } from 'lucide-react';
import { shareContent } from '@/utils/shareUtils';

interface EventActionsProps {
  eventId: string;
  title: string;
}

const EventActions = ({ eventId, title }: EventActionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const checkEventOwnership = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if the event belongs to an organization owned by the user
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('id')
          .eq('user_id', user.id);

        if (orgsError) throw orgsError;

        if (orgs && orgs.length > 0) {
          const orgIds = orgs.map(org => org.id);
          
          const { data, error } = await supabase
            .from('events')
            .select('id')
            .eq('id', eventId)
            .in('organization_id', orgIds)
            .single();

          if (!error && data) {
            setIsOwner(true);
          }
        }
      } catch (error) {
        console.error('Error checking event ownership:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEventOwnership();
  }, [user, eventId]);

  const handleShare = () => {
    const url = `${window.location.origin}/evento/${eventId}`;
    shareContent(
      `Evento: ${title}`, 
      `Venha participar do evento ${title}!`, 
      url
    );
  };

  const handleEdit = () => {
    navigate(`/ong/dashboard/evento/${eventId}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
        
      if (error) throw error;
      
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso."
      });
      
      navigate('/ong/dashboard');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Ações</h3>
      <div className="space-y-2">
        <Button 
          onClick={handleShare} 
          className="w-full flex items-center justify-center"
          variant="outline"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
        
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : isOwner ? (
          <>
            <Button 
              onClick={handleEdit} 
              className="w-full flex items-center justify-center"
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Evento
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full flex items-center justify-center"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Excluir evento</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EventActions;
