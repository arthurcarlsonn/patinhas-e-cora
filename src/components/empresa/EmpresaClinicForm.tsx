
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

const EmpresaClinicForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<{ id: string; company_name: string } | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  
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
    social_media: '',
    has_parking: false,
    has_home_service: false
  });
  
  const [imageFile, setImageFile] = useState<File[] | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/entrar');
      return;
    }
    
    const fetchCompany = async () => {
      setIsLoadingCompany(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCompany(data);
          // Pre-fill some form fields
          setFormData(prev => ({
            ...prev,
            name: data.company_name || prev.name,
          }));
        }
      } catch (error: any) {
        console.error('Error fetching company data:', error);
        toast({
          title: "Erro ao carregar dados da empresa",
          description: "Por favor, complete seu perfil de empresa antes de cadastrar clínicas.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCompany(false);
      }
    };
    
    fetchCompany();
  }, [user, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar uma clínica.",
        variant: "destructive"
      });
      return;
    }
    
    if (!company) {
      toast({
        title: "Perfil incompleto",
        description: "Complete seu perfil de empresa antes de cadastrar clínicas.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
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
      if (formData.social_media) {
        formData.social_media.split(',').forEach(item => {
          const [platform, handle] = item.split(':').map(s => s.trim());
          if (platform && handle) {
            socialMediaObj[platform.toLowerCase()] = handle;
          }
        });
      }
      
      // Upload image if provided
      let imageUrl = undefined;
      if (imageFile && imageFile.length > 0) {
        try {
          const urls = await uploadMultipleImages(imageFile);
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
          setIsSubmitting(false);
          return;
        }
      }
      
      // Insert clinic into database
      const { data: clinic, error } = await supabase
        .from('clinics')
        .insert({
          user_id: user.id,
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
          social_media: socialMediaObj,
          has_parking: formData.has_parking,
          has_home_service: formData.has_home_service,
          main_image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Clínica cadastrada com sucesso!",
        description: "Sua clínica foi adicionada ao sistema."
      });
      
      // Reset form
      setFormData({
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
        social_media: '',
        has_parking: false,
        has_home_service: false
      });
      setImageFile(null);
      
      // Redirect to manage clinics page
      navigate('/empresa-dashboard/clinics');
      
    } catch (error: any) {
      console.error('Erro ao cadastrar clínica:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível cadastrar a clínica. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingCompany) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar Nova Clínica</CardTitle>
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
              placeholder="Veterinária, Pet Shop, etc." 
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
            <Label htmlFor="social_media">Redes Sociais (formato: plataforma:@usuario, ...)</Label>
            <Input 
              id="social_media" 
              placeholder="instagram:@exemplo, facebook:/exemplo" 
              value={formData.social_media} 
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
            onChange={setImageFile}
            value={imageFile}
            required={false}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Clínica'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmpresaClinicForm;
