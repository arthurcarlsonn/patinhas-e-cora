
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import MediaUpload from '@/components/MediaUpload';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
}

interface OngEditEventProps {
  event: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

const OngEditEvent = ({ event, onSuccess, onCancel }: OngEditEventProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    location: event.location || '',
    category: event.category || '',
  });
  const [date, setDate] = useState<Date | undefined>(
    event.date ? new Date(event.date) : undefined
  );
  const [image, setImage] = useState<File[] | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(
    event.main_image_url
  );

  useEffect(() => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      category: event.category || '',
    });
    setDate(event.date ? new Date(event.date) : undefined);
    setCurrentImageUrl(event.main_image_url);
  }, [event]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para o evento.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload new image if provided
      let imageUrl = currentImageUrl;
      if (image && image.length > 0) {
        try {
          const urls = await uploadMultipleImages(image);
          if (urls.length > 0) {
            imageUrl = urls[0];
          }
        } catch (err) {
          console.error("Erro ao fazer upload da imagem:", err);
          toast({
            title: "Erro no upload",
            description: "Não foi possível fazer upload da imagem. Tente novamente.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      // Update event in database
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          date: date.toISOString(),
          location: formData.location,
          category: formData.category,
          main_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', event.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Evento atualizado",
        description: "As informações do evento foram atualizadas com sucesso.",
      });

      // Call parent's success handler
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Título do Evento</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Data do Evento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Imagem do Evento</Label>
        <MediaUpload
          id="event-image"
          label="Imagem do Evento"
          accept="image/*"
          multiple={false}
          onChange={setImage}
          value={image}
          existingUrls={currentImageUrl ? [currentImageUrl] : []}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </div>
    </form>
  );
};

export default OngEditEvent;
