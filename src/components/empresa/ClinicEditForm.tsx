
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClinicCardProps } from '@/components/ClinicCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, X } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface ClinicEditFormProps {
  clinic: ClinicCardProps;
  onCancel: () => void;
  onUpdate: (updatedClinic: ClinicCardProps) => void;
}

const ClinicEditForm = ({ clinic, onCancel, onUpdate }: ClinicEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    location: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    openHours: '',
    socialMedia: '',
    specialties: [] as string[],
    services: [] as string[],
    hasHomeService: false,
    hasParking: false
  });
  
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newService, setNewService] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Add veterinarians management
  const [veterinarians, setVeterinarians] = useState<Array<{id?: string, name: string, specialty: string}>>([]);
  const [newVeterinarian, setNewVeterinarian] = useState({name: '', specialty: ''});
  
  // Load the full clinic data
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', clinic.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.name || '',
            category: data.category || '',
            description: data.description || '',
            address: data.address || '',
            location: data.location || '',
            phone: data.phone || '',
            email: data.email || '',
            whatsapp: data.whatsapp || '',
            website: data.website || '',
            openHours: data.open_hours || '',
            socialMedia: formatSocialMediaForInput(data.social_media),
            specialties: data.specialties || [],
            services: data.services || [],
            hasHomeService: data.has_home_service || false,
            hasParking: data.has_parking || false
          });
          
          // Set main image
          if (data.main_image_url) {
            setExistingImages([data.main_image_url]);
          }
          
          // Fetch veterinarians
          const { data: vetsData, error: vetsError } = await supabase
            .from('veterinarians')
            .select('*')
            .eq('clinic_id', clinic.id);
            
          if (!vetsError && vetsData) {
            setVeterinarians(vetsData.map(vet => ({
              id: vet.id,
              name: vet.name,
              specialty: vet.specialty
            })));
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
  }, [clinic.id, toast]);
  
  const formatSocialMediaForInput = (socialMedia: any) => {
    if (!socialMedia) return '';
    
    return Object.entries(socialMedia)
      .map(([platform, handle]) => `${platform}:${handle}`)
      .join(', ');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(item => item !== specialty)
    }));
  };
  
  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };
  
  const handleRemoveService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(item => item !== service)
    }));
  };
  
  // Veterinarian handlers
  const handleVeterinarianChange = (field: string, value: string) => {
    setNewVeterinarian(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddVeterinarian = () => {
    if (newVeterinarian.name.trim() && newVeterinarian.specialty.trim()) {
      setVeterinarians(prev => [...prev, { 
        name: newVeterinarian.name.trim(), 
        specialty: newVeterinarian.specialty.trim() 
      }]);
      setNewVeterinarian({name: '', specialty: ''});
    }
  };
  
  const handleRemoveVeterinarian = (index: number) => {
    setVeterinarians(prev => prev.filter((_, i) => i !== index));
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
      let uploadedImageUrls: string[] = [];
      let mainImageUrl = existingImages[0] || null; // Use the first existing image as main if no new images
      
      if (images && images.length > 0) {
        uploadedImageUrls = await uploadMultipleImages(images);
        if (uploadedImageUrls.length > 0) {
          mainImageUrl = uploadedImageUrls[0]; // First new image becomes main image
        }
      }
      
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
      
      // Update clinic in database
      const { data: updatedClinic, error } = await supabase
        .from('clinics')
        .update({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          address: formData.address,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          website: formData.website,
          open_hours: formData.openHours,
          social_media: socialMediaObj,
          specialties: formData.specialties,
          services: formData.services,
          has_home_service: formData.hasHomeService,
          has_parking: formData.hasParking,
          main_image_url: mainImageUrl, // Update main image if new images uploaded
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Handle veterinarians
      
      // First, get all existing veterinarian IDs
      const { data: existingVets, error: vetsError } = await supabase
        .from('veterinarians')
        .select('id')
        .eq('clinic_id', clinic.id);
        
      if (vetsError) throw vetsError;
      
      const existingVetIds = existingVets?.map(vet => vet.id) || [];
      const currentVetIds = veterinarians.filter(vet => vet.id).map(vet => vet.id);
      
      // Delete veterinarians that are no longer in the list
      const vetsToDelete = existingVetIds.filter(id => !currentVetIds.includes(id));
      if (vetsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('veterinarians')
          .delete()
          .in('id', vetsToDelete);
          
        if (deleteError) throw deleteError;
      }
      
      // Add new veterinarians and update existing ones
      for (const vet of veterinarians) {
        if (vet.id) {
          // Update existing veterinarian
          const { error: updateError } = await supabase
            .from('veterinarians')
            .update({
              name: vet.name,
              specialty: vet.specialty
            })
            .eq('id', vet.id);
            
          if (updateError) throw updateError;
        } else {
          // Add new veterinarian
          const { error: insertError } = await supabase
            .from('veterinarians')
            .insert({
              clinic_id: clinic.id,
              name: vet.name,
              specialty: vet.specialty
            });
            
          if (insertError) throw insertError;
        }
      }
      
      // Create updated clinic card data
      const updatedClinicCard: ClinicCardProps = {
        ...clinic,
        name: formData.name,
        category: formData.category,
        location: formData.location,
        image: mainImageUrl || clinic.image
      };
      
      toast({
        title: "Clínica atualizada",
        description: "A clínica foi atualizada com sucesso.",
      });
      
      // Call the parent component with updated data
      onUpdate(updatedClinicCard);
      
    } catch (error) {
      console.error('Erro ao atualizar clínica:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a clínica. Tente novamente.",
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
        <Label htmlFor="name">Nome da Clínica/Hospital</Label>
        <Input 
          id="name" 
          placeholder="Nome da clínica ou hospital veterinário" 
          value={formData.name}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clinica">Clínica Veterinária</SelectItem>
            <SelectItem value="hospital">Hospital Veterinário</SelectItem>
            <SelectItem value="petshop">Pet Shop com Atendimento</SelectItem>
            <SelectItem value="especializada">Clínica Especializada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          placeholder="Descreva a clínica ou hospital detalhadamente" 
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <MediaUpload
        id="imagens"
        label="Imagens da Clínica"
        accept="image/*"
        multiple={true}
        onChange={setImages}
        value={images}
        existingUrls={existingImages}
      />
      
      <div>
        <Label htmlFor="address">Endereço Completo</Label>
        <Input 
          id="address" 
          placeholder="Rua, número, complemento" 
          value={formData.address}
          onChange={handleInputChange}
          required 
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
        <Label htmlFor="openHours">Horário de Funcionamento</Label>
        <Input 
          id="openHours" 
          placeholder="Ex: Segunda a Sexta: 8h às 18h, Sábado: 9h às 13h" 
          value={formData.openHours}
          onChange={handleInputChange}
          required 
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
          <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
          <Input 
            id="whatsapp" 
            placeholder="(00) 00000-0000" 
            value={formData.whatsapp}
            onChange={handleInputChange}
          />
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
      </div>
      
      <div>
        <Label htmlFor="socialMedia">Redes Sociais (opcional)</Label>
        <Input 
          id="socialMedia" 
          placeholder="Instagram: @exemplo, Facebook: /exemplo" 
          value={formData.socialMedia}
          onChange={handleInputChange}
        />
      </div>
      
      {/* Especialidades */}
      <div className="space-y-2">
        <Label>Especialidades</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.specialties.map((specialty, index) => (
            <div key={index} className="bg-pet-lightPurple/20 px-3 py-1 rounded-full flex items-center gap-2">
              <span>{specialty}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveSpecialty(specialty)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Adicionar especialidade"
            className="flex-1"
          />
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddSpecialty}
          >
            <Plus size={16} className="mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
      
      {/* Serviços */}
      <div className="space-y-2">
        <Label>Serviços Oferecidos</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.services.map((service, index) => (
            <div key={index} className="bg-pet-lightPurple/20 px-3 py-1 rounded-full flex items-center gap-2">
              <span>{service}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveService(service)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Adicionar serviço"
            className="flex-1"
          />
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddService}
          >
            <Plus size={16} className="mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
      
      {/* Veterinários */}
      <div className="space-y-4">
        <Label>Veterinários</Label>
        
        <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded-md">
          {veterinarians.map((vet, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <div className="flex-1 space-y-2">
                <p className="font-medium">{vet.name}</p>
                <p className="text-sm text-gray-500">Especialidade: {vet.specialty}</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleRemoveVeterinarian(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {veterinarians.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhum veterinário cadastrado.</p>
          )}
        </div>
        
        <div className="p-4 border rounded-md space-y-4">
          <h4 className="font-medium">Adicionar Veterinário</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vetName">Nome</Label>
              <Input 
                id="vetName"
                value={newVeterinarian.name}
                onChange={(e) => handleVeterinarianChange('name', e.target.value)}
                placeholder="Nome do veterinário"
              />
            </div>
            <div>
              <Label htmlFor="vetSpecialty">Especialidade</Label>
              <Input 
                id="vetSpecialty"
                value={newVeterinarian.specialty}
                onChange={(e) => handleVeterinarianChange('specialty', e.target.value)}
                placeholder="Especialidade"
              />
            </div>
          </div>
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddVeterinarian}
            className="w-full"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Veterinário
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="hasHomeService" 
            checked={formData.hasHomeService}
            onCheckedChange={(checked) => handleSwitchChange('hasHomeService', checked)}
          />
          <Label htmlFor="hasHomeService">Oferece atendimento domiciliar?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="hasParking" 
            checked={formData.hasParking}
            onCheckedChange={(checked) => handleSwitchChange('hasParking', checked)}
          />
          <Label htmlFor="hasParking">Possui estacionamento?</Label>
        </div>
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
