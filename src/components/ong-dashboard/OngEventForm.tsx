
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Loader2, Calendar, MapPin, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadMultipleImages } from '@/utils/uploadUtils';
import MediaUpload from '@/components/MediaUpload';

const OngEventForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: ''
  });
  const [image, setImage] = useState<File[] | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserOrgs = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setOrganizations(data);
          setSelectedOrgId(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar organizações:', error);
        toast.error('Não foi possível carregar suas organizações');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrgs();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedOrgId) {
      toast.error("Você precisa selecionar uma organização para criar um evento");
      return;
    }

    setSaving(true);
    
    try {
      // Upload da imagem
      let imageUrl = null;
      if (image && image.length > 0) {
        const urls = await uploadMultipleImages(image);
        if (urls.length > 0) {
          imageUrl = urls[0];
        }
      }

      // Combinar data e hora
      const dateTime = new Date(`${formData.date}T${formData.time || '00:00'}`).toISOString();

      // Inserir evento no banco de dados
      const { data: eventData, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          date: dateTime,
          location: formData.location,
          description: formData.description,
          category: formData.category,
          organization_id: selectedOrgId,
          main_image_url: imageUrl
        })
        .select();

      if (error) throw error;

      toast.success("Seu evento foi publicado com sucesso!");

      // Limpar formulário
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: ''
      });
      setImage(null);
      
    } catch (error: any) {
      console.error('Erro ao cadastrar evento:', error);
      toast.error(error.message || "Não foi possível publicar seu evento. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pet-purple" />
        </div>
      </Card>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Nenhuma ONG cadastrada</h2>
            <p className="text-gray-600 mb-6">
              Você precisa cadastrar uma ONG antes de criar eventos.
            </p>
            <Button
              onClick={() => window.location.href = '#cadastro'}
              className="bg-pet-purple hover:bg-pet-lightPurple"
            >
              Cadastrar minha ONG
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6 text-pet-darkPurple">Criar Novo Evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {organizations.length > 1 && (
            <div>
              <Label htmlFor="organization_id">Organização responsável</Label>
              <Select
                value={selectedOrgId}
                onValueChange={setSelectedOrgId}
                required
              >
                <SelectTrigger id="organization_id">
                  <SelectValue placeholder="Selecione a organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Nome do evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Digite o título do evento"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="date"
                  type="date"
                  className="pl-8"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Local</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="location"
                className="pl-8"
                placeholder="Endereço ou local do evento"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger id="category">
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
            <Label htmlFor="description">Descrição do evento</Label>
            <Textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva detalhes importantes sobre o evento"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Imagem do Evento</Label>
            <MediaUpload 
              id="event-image"
              label="Selecione uma imagem para o evento"
              accept="image/*"
              multiple={false}
              onChange={setImage}
              value={image}
              required={false}
            />
          </div>
          
          <Button
            type="submit"
            className="bg-pet-purple hover:bg-pet-lightPurple"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...
              </>
            ) : (
              'Publicar Evento'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OngEventForm;
