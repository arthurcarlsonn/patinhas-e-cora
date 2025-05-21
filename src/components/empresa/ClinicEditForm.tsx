
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface ClinicEditFormProps {
  clinicId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Clinic {
  id: string;
  name: string;
  category: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  description?: string;
  specialties?: string[];
  services?: string[];
  open_hours?: string;
  has_parking?: boolean;
  has_home_service?: boolean;
  main_image_url?: string;
  social_media?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  views?: number;
}

const ClinicEditForm = ({ clinicId, onSuccess, onCancel }: ClinicEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    description: '',
    specialties: '',
    services: '',
    open_hours: '',
    has_parking: false,
    has_home_service: false,
    socialMedia: ''
  });
  
  const [images, setImages] = useState<File[] | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const fetchClinic = async () => {
      if (!clinicId) return;
      
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', clinicId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Convert data to our Clinic interface type
          const clinicData: Clinic = {
            id: data.id,
            name: data.name,
            category: data.category,
            location: data.location,
            address: data.address,
            phone: data.phone,
            email: data.email,
            whatsapp: data.whatsapp,
            website: data.website,
            description: data.description,
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
            services: Array.isArray(data.services) ? data.services : [],
            open_hours: data.open_hours,
            has_parking: data.has_parking || false,
            has_home_service: data.has_home_service || false,
            main_image_url: data.main_image_url,
            social_media: typeof data.social_media === 'object' ? data.social_media : {},
            created_at: data.created_at,
            updated_at: data.updated_at,
            user_id: data.user_id,
            views: data.views || 0
          };
          
          setClinic(clinicData);
          setFormData({
            name: clinicData.name || '',
            category: clinicData.category || '',
            location: clinicData.location || '',
            address: clinicData.address || '',
            phone: clinicData.phone || '',
            email: clinicData.email || '',
            whatsapp: clinicData.whatsapp || '',
            website: clinicData.website || '',
            description: clinicData.description || '',
            specialties: clinicData.specialties ? clinicData.specialties.join(', ') : '',
            services: clinicData.services ? clinicData.services.join(', ') : '',
            open_hours: clinicData.open_hours || '',
            has_parking: clinicData.has_parking || false,
            has_home_service: clinicData.has_home_service || false,
            socialMedia: formatSocialMediaForInput(clinicData.social_media)
          });
          
          if (clinicData.main_image_url) {
            setCurrentImageUrl(clinicData.main_image_url);
          }
        }
      } catch (error: any) {
        console.error('Erro ao carregar clínica:', error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os detalhes da clínica.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClinic();
  }, [clinicId, toast]);
  
  const formatSocialMediaForInput = (socialMedia: Record<string, string> | undefined) => {
    if (!socialMedia) return '';
    
    return Object.entries(socialMedia)
      .map(([platform, handle]) => `${platform}:${handle}`)
      .join(', ');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinic) return;
    
    setIsSaving(true);
    
    try {
      // Process specialties and services as arrays
      const specialties = formData.specialties
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
        
      const services = formData.services
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
      
      // Process social media into JSON object
      const socialMediaObj: Record<string, string> = {};
      if (formData.socialMedia) {
        formData.socialMedia.split(',').forEach(item => {
          const [platform, handle] = item.split(':').map(s => s.trim());
          if (platform && handle) {
            socialMediaObj[platform.toLowerCase()] = handle;
          }
        });
      }
      
      // Upload new image if provided
      let mainImageUrl = currentImageUrl;
      if (images && images.length > 0) {
        try {
          const urls = await uploadMultipleImages(images);
          if (urls.length > 0) {
            mainImageUrl = urls[0];
          }
        } catch (err) {
          console.error("Erro ao fazer upload da imagem:", err);
          toast({
            title: "Erro no upload",
            description: "Não foi possível fazer upload da imagem. Tente novamente.",
            variant: "destructive"
          });
          setIsSaving(false);
          return;
        }
      }
      
      // Update clinic in database
      const { error } = await supabase
        .from('clinics')
        .update({
          name: formData.name,
          category: formData.category,
          location: formData.location,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          website: formData.website,
          description: formData.description,
          specialties,
          services,
          open_hours: formData.open_hours,
          has_parking: formData.has_parking,
          has_home_service: formData.has_home_service,
          social_media: socialMediaObj,
          main_image_url: mainImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id);
      
      if (error) throw error;
      
      toast({
        title: "Clínica atualizada",
        description: "As informações da clínica foram atualizadas com sucesso."
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Erro ao atualizar clínica:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a clínica. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!clinic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-red-500">
            Clínica não encontrada
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Clínica</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Clínica</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              placeholder="Cidade, Estado"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              placeholder="Rua, número, bairro, CEP"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="socialMedia">Redes Sociais (formato: plataforma:@usuario, ...)</Label>
            <Input
              id="socialMedia"
              placeholder="instagram:@exemplo, facebook:/exemplo"
              value={formData.socialMedia}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has_parking"
                checked={formData.has_parking}
                onCheckedChange={(checked) => handleSwitchChange('has_parking', checked)}
              />
              <Label htmlFor="has_parking">Possui estacionamento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_home_service"
                checked={formData.has_home_service}
                onCheckedChange={(checked) => handleSwitchChange('has_home_service', checked)}
              />
              <Label htmlFor="has_home_service">Atendimento em domicílio</Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
            <Input
              id="specialties"
              placeholder="Cardiologia, Dermatologia, etc."
              value={formData.specialties}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="services">Serviços (separados por vírgula)</Label>
            <Input
              id="services"
              placeholder="Consultas, Vacinas, Cirurgias, etc."
              value={formData.services}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="open_hours">Horário de Funcionamento</Label>
            <Input
              id="open_hours"
              placeholder="Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h"
              value={formData.open_hours}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <MediaUpload
            id="clinic-image"
            label="Imagem da Clínica"
            accept="image/*"
            multiple={false}
            onChange={setImages}
            value={images}
            existingUrls={currentImageUrl ? [currentImageUrl] : []}
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClinicEditForm;
