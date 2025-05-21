import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadImage } from '@/utils/uploadUtils';

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
}

const OngEditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [eventData, setEventData] = useState<EventData>({
    id: '',
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    main_image_url: '',
    organization_id: ''
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [userOrgs, setUserOrgs] = useState<{ id: string, name: string }[]>([]);
  
  // Format date string to datetime-local input format
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Format datetime-local input value to ISO string for database
  const formatDateForDatabase = (dateString: string): string => {
    return new Date(dateString).toISOString();
  };

  // Fetch user organizations
  useEffect(() => {
    if (!user) return;
    
    const fetchUserOrgs = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setUserOrgs(data);
        }
      } catch (error) {
        console.error('Error fetching user organizations:', error);
      }
    };
    
    fetchUserOrgs();
  }, [user]);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id || !user) return;
      
      try {
        // Get user organizations first
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('id')
          .eq('user_id', user.id);
        
        if (orgsError) throw orgsError;
        
        if (!orgs || orgs.length === 0) {
          toast.error("Acesso negado. Você não possui uma organização cadastrada.");
          navigate('/ong/dashboard');
          return;
        }
        
        const orgIds = orgs.map(o => o.id);
        
        // Get event data
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .in('organization_id', orgIds)
          .single();
          
        if (eventError) {
          if (eventError.code === 'PGRST116') {
            toast.error("Evento não encontrado. O evento não existe ou você não tem permissão para editá-lo.");
            navigate('/ong/dashboard');
          }
          throw eventError;
        }
        
        if (!event) {
          toast.error("Evento não encontrado. O evento não existe ou você não tem permissão para editá-lo.");
          navigate('/ong/dashboard');
          return;
        }
        
        // Set event data
        setEventData({
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          date: formatDateForInput(event.date),
          category: event.category,
          main_image_url: event.main_image_url,
          organization_id: event.organization_id
        });
        
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error("Erro ao carregar dados do evento. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id, user, navigate, toast]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    
    setIsSaving(true);
    
    try {
      let imageUrl = eventData.main_image_url;
      
      // Upload new image if provided
      if (image) {
        const uploadedUrl = await uploadImage(image);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      // Update event data
      const { error: updateError } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          date: formatDateForDatabase(eventData.date),
          category: eventData.category,
          main_image_url: imageUrl,
          organization_id: eventData.organization_id
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast.success("Alterações salvas. Os dados do evento foram atualizados com sucesso.");
      
      // Redirect to organization dashboard
      navigate('/ong/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Erro ao atualizar o evento. Tente novamente mais tarde.");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pet-purple" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => navigate('/ong/dashboard')} 
        variant="ghost" 
        className="mb-4 flex items-center text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Editar Evento</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <Label htmlFor="title">Título do Evento</Label>
          <Input 
            id="title" 
            value={eventData.title} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="organization_id">Organização</Label>
          <Select 
            value={eventData.organization_id} 
            onValueChange={(value) => handleSelectChange('organization_id', value)}
            disabled={userOrgs.length <= 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a organização" />
            </SelectTrigger>
            <SelectContent>
              {userOrgs.map((org) => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={eventData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adocao">Adoção</SelectItem>
              <SelectItem value="castracao">Castração</SelectItem>
              <SelectItem value="feira">Feira</SelectItem>
              <SelectItem value="vacinacao">Vacinação</SelectItem>
              <SelectItem value="arrecadacao">Arrecadação</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date">Data e Hora</Label>
          <Input 
            id="date" 
            type="datetime-local" 
            value={eventData.date} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="location">Localização</Label>
          <Input 
            id="location" 
            value={eventData.location} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            rows={5} 
            value={eventData.description} 
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Current Image Preview */}
        {eventData.main_image_url && (
          <div>
            <Label>Imagem Atual</Label>
            <div className="mt-2 rounded-lg overflow-hidden border">
              <img 
                src={eventData.main_image_url} 
                alt="Imagem do evento" 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800x400?text=Evento";
                }}
              />
            </div>
          </div>
        )}
        
        {/* New Image Upload */}
        <div>
          <Label>Alterar Imagem</Label>
          <MediaUpload
            id="event-image"
            label=""
            accept="image/*"
            multiple={false}
            onChange={(files) => files && files.length > 0 ? setImage(files[0]) : setImage(null)}
            value={image ? new FileList([image], '') : null}
          />
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-pet-purple hover:bg-pet-lightPurple"
            disabled={isSaving}
          >
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OngEditEvent;
