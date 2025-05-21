
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Phone, Mail, Globe, Facebook, Instagram } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

// Define Clinic interface
interface Clinic {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  website?: string;
  specialties?: string[];
  services?: string[];
  open_hours?: string;
  has_parking: boolean;
  has_home_service: boolean;
  main_image_url?: string;
  social_media?: any;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ClinicEditFormProps {
  clinicId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ClinicEditForm = ({ clinicId, onCancel, onSuccess }: ClinicEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [clinic, setClinic] = useState<Clinic>({
    id: '',
    name: '',
    description: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    specialties: [],
    services: [],
    open_hours: '',
    has_parking: false,
    has_home_service: false,
    main_image_url: '',
    social_media: { facebook: '', instagram: '' },
    user_id: '',
  });
  
  const [images, setImages] = useState<File[] | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Load the clinic data
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', clinicId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const clinicData = {
            ...data,
            social_media: typeof data.social_media === 'string' 
              ? JSON.parse(data.social_media) 
              : data.social_media || { facebook: '', instagram: '' }
          };
          
          setClinic(clinicData as Clinic);
          
          // Set main image
          if (data.main_image_url) {
            setExistingImages([data.main_image_url]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes da clínica:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes da clínica.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchClinicDetails();
  }, [clinicId, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setClinic(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setClinic(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setClinic(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para atualizar uma clínica.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload any new images
      let mainImageUrl = clinic.main_image_url || null;
      
      if (images && images.length > 0) {
        const uploadedImageUrls = await uploadMultipleImages(images);
        if (uploadedImageUrls.length > 0) {
          mainImageUrl = uploadedImageUrls[0];
        }
      }
      
      // Process social media into proper format
      const socialMedia = {
        facebook: clinic.social_media?.facebook || '',
        instagram: clinic.social_media?.instagram || '',
      };
      
      // Update clinic in database
      const { data: updatedClinic, error } = await supabase
        .from('clinics')
        .update({
          name: clinic.name,
          description: clinic.description,
          category: clinic.category,
          location: clinic.location,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          whatsapp: clinic.whatsapp,
          website: clinic.website,
          specialties: clinic.specialties,
          services: clinic.services,
          open_hours: clinic.open_hours,
          has_parking: clinic.has_parking,
          has_home_service: clinic.has_home_service,
          main_image_url: mainImageUrl,
          social_media: socialMedia,
          updated_at: new Date().toISOString()
        })
        .eq('id', clinicId)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Clínica atualizada",
        description: "A clínica foi atualizada com sucesso."
      });
      
      onSuccess();
      
    } catch (error: any) {
      console.error('Erro ao atualizar clínica:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a clínica. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pet-purple mb-4" />
        <p>Carregando detalhes da clínica...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Editar Clínica</h3>
      </div>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={clinic.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clinica">Clínica Veterinária</SelectItem>
            <SelectItem value="hospital">Hospital Veterinário</SelectItem>
            <SelectItem value="consultorio">Consultório</SelectItem>
            <SelectItem value="petshop">Pet Shop com Veterinário</SelectItem>
            <SelectItem value="especialidade">Clínica Especializada</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          placeholder="Nome da clínica" 
          value={clinic.name}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          placeholder="Descreva a clínica detalhadamente" 
          rows={4}
          value={clinic.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
        <Input 
          id="specialties" 
          placeholder="Clínica Geral, Dermatologia, Ortopedia, etc." 
          value={clinic.specialties?.join(', ') || ''}
          onChange={(e) => setClinic({...clinic, specialties: e.target.value ? e.target.value.split(',').map(s => s.trim()) : []})}
        />
      </div>
      
      <div>
        <Label htmlFor="services">Serviços (separados por vírgula)</Label>
        <Input 
          id="services" 
          placeholder="Consultas, Exames, Cirurgias, etc." 
          value={clinic.services?.join(', ') || ''}
          onChange={(e) => setClinic({...clinic, services: e.target.value ? e.target.value.split(',').map(s => s.trim()) : []})}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-gray-400" />
            <Input 
              id="phone" 
              placeholder="(00) 0000-0000" 
              value={clinic.phone}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-gray-400" />
            <Input 
              id="whatsapp" 
              placeholder="(00) 00000-0000" 
              value={clinic.whatsapp}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">E-mail</Label>
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-gray-400" />
          <Input 
            id="email" 
            type="email" 
            placeholder="contato@clinica.com" 
            value={clinic.email}
            onChange={handleInputChange}
            required 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="website">Website (opcional)</Label>
        <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4 text-gray-400" />
          <Input 
            id="website" 
            placeholder="www.clinica.com.br" 
            value={clinic.website || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="social_media_facebook">Facebook (opcional)</Label>
          <div className="flex items-center">
            <Facebook className="mr-2 h-4 w-4 text-gray-400" />
            <Input 
              id="social_media_facebook" 
              placeholder="facebook.com/clinica" 
              value={clinic.social_media?.facebook || ''}
              onChange={(e) => setClinic({...clinic, social_media: {...clinic.social_media, facebook: e.target.value}})}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="social_media_instagram">Instagram (opcional)</Label>
          <div className="flex items-center">
            <Instagram className="mr-2 h-4 w-4 text-gray-400" />
            <Input 
              id="social_media_instagram" 
              placeholder="@clinica" 
              value={clinic.social_media?.instagram || ''}
              onChange={(e) => setClinic({...clinic, social_media: {...clinic.social_media, instagram: e.target.value}})}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Cidade/Estado</Label>
        <Input 
          id="location" 
          placeholder="Cidade, Estado" 
          value={clinic.location}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="address">Endereço Completo</Label>
        <Input 
          id="address" 
          placeholder="Rua, Número, Bairro, CEP" 
          value={clinic.address}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="open_hours">Horário de Funcionamento</Label>
        <Input 
          id="open_hours" 
          placeholder="Seg-Sex: 8h às 18h, Sáb: 8h às 12h" 
          value={clinic.open_hours || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="has_parking" 
          checked={clinic.has_parking}
          onCheckedChange={(checked) => handleSwitchChange('has_parking', checked)}
        />
        <Label htmlFor="has_parking">Estacionamento disponível</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="has_home_service" 
          checked={clinic.has_home_service}
          onCheckedChange={(checked) => handleSwitchChange('has_home_service', checked)}
        />
        <Label htmlFor="has_home_service">Atendimento a domicílio</Label>
      </div>
      
      <div>
        <Label htmlFor="image">Imagem Principal</Label>
        <MediaUpload
          id="image"
          label="Selecione uma imagem"
          accept="image/*"
          multiple={true}
          onChange={setImages}
          value={images}
          existingUrls={existingImages}
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-pet-purple hover:bg-pet-lightPurple"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ClinicEditForm;
