
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface EmpresaClinicFormProps {
  onSuccess: () => void;
}

interface Company {
  id: string;
  company_name: string;
  email?: string;
}

const EmpresaClinicForm = ({ onSuccess }: EmpresaClinicFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    specialties: '',
    services: '',
    open_hours: '',
    has_parking: false,
    has_home_service: false
  });
  
  const [clinicImage, setClinicImage] = useState<File[] | null>(null);
  
  useEffect(() => {
    const getUserCompany = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name, email')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar empresa:', error);
          return;
        }
        
        if (data) {
          setCompany({
            id: data.id,
            company_name: data.company_name,
            email: data.email
          });
          
          // Pre-fill some form fields
          setFormData(prev => ({
            ...prev,
            email: data.email || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        toast.error('Não foi possível carregar os dados da empresa');
      }
    };
    
    getUserCompany();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para cadastrar uma clínica');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload images
      let mainImageUrl = null;
      
      if (clinicImage && clinicImage.length > 0) {
        const uploadedUrls = await uploadMultipleImages(clinicImage);
        
        if (uploadedUrls.length > 0) {
          mainImageUrl = uploadedUrls[0];
        }
      }
      
      // Process specialties and services
      const specialtiesArray = formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [];
      const servicesArray = formData.services ? formData.services.split(',').map(s => s.trim()) : [];
      
      // Insert clinic
      const { data, error } = await supabase
        .from('clinics')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          website: formData.website || null,
          specialties: specialtiesArray,
          services: servicesArray,
          open_hours: formData.open_hours || null,
          has_parking: formData.has_parking,
          has_home_service: formData.has_home_service,
          main_image_url: mainImageUrl,
          user_id: user.id,
          social_media: { 
            instagram: '',
            facebook: ''
          }
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Clínica cadastrada com sucesso!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        whatsapp: '',
        website: '',
        specialties: '',
        services: '',
        open_hours: '',
        has_parking: false,
        has_home_service: false
      });
      setClinicImage(null);
      
      // Notify parent component
      onSuccess();
      
    } catch (error: any) {
      console.error('Erro ao cadastrar clínica:', error);
      toast.error(error.message || 'Erro ao cadastrar clínica. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={formData.category} 
          onValueChange={handleSelectChange}
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
          value={formData.name}
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
          value={formData.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
        <Input 
          id="specialties" 
          placeholder="Clínica Geral, Dermatologia, Ortopedia, etc." 
          value={formData.specialties}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="services">Serviços (separados por vírgula)</Label>
        <Input 
          id="services" 
          placeholder="Consultas, Exames, Cirurgias, etc." 
          value={formData.services}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            placeholder="(00) 0000-0000" 
            value={formData.phone}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input 
            id="whatsapp" 
            placeholder="(00) 00000-0000" 
            value={formData.whatsapp}
            onChange={handleInputChange}
            required 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="contato@clinica.com" 
          value={formData.email}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="website">Website (opcional)</Label>
        <Input 
          id="website" 
          placeholder="www.clinica.com.br" 
          value={formData.website}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="location">Cidade/Estado</Label>
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
          placeholder="Rua, Número, Bairro, CEP" 
          value={formData.address}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="open_hours">Horário de Funcionamento</Label>
        <Input 
          id="open_hours" 
          placeholder="Seg-Sex: 8h às 18h, Sáb: 8h às 12h" 
          value={formData.open_hours}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="has_parking" 
          checked={formData.has_parking}
          onCheckedChange={(checked) => handleSwitchChange('has_parking', checked)}
        />
        <Label htmlFor="has_parking">Estacionamento disponível</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="has_home_service" 
          checked={formData.has_home_service}
          onCheckedChange={(checked) => handleSwitchChange('has_home_service', checked)}
        />
        <Label htmlFor="has_home_service">Atendimento a domicílio</Label>
      </div>
      
      <div>
        <Label htmlFor="clinicImage">Imagem da Clínica</Label>
        <MediaUpload
          id="clinicImage"
          label="Selecione uma imagem"
          accept="image/*"
          multiple={false}
          onChange={setClinicImage}
          value={clinicImage}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-pet-purple hover:bg-pet-lightPurple" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cadastrando...
          </>
        ) : (
          'Cadastrar Clínica'
        )}
      </Button>
    </form>
  );
};

export default EmpresaClinicForm;
