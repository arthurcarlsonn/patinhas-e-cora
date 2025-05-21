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
import { Switch } from '@/components/ui/switch';
import { Loader2, ArrowLeft } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

const PetEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    temperament: '',
    description: '',
    status: '',
    location: '',
    contact_whatsapp: '',
    is_vaccinated: false,
    is_neutered: false,
    accepts_children: false,
    accepts_other_animals: false
  });
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[] | null>(null);
  const [currentImages, setCurrentImages] = useState<{id: string, url: string}[]>([]);

  // Fetch pet data
  useEffect(() => {
    const fetchPetData = async () => {
      if (!id || !user) return;
      
      try {
        // Get main pet data
        const { data: pet, error: petError } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (petError) throw petError;
        if (!pet) {
          toast({
            title: "Erro",
            description: "Pet não encontrado. Tente novamente mais tarde.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
        
        // Get additional pet images
        const { data: images, error: imagesError } = await supabase
          .from('pet_images')
          .select('*')
          .eq('pet_id', id)
          .order('created_at', { ascending: true });
          
        if (imagesError) throw imagesError;
        
        // Set pet data in form
        setPetData({
          name: pet.name || '',
          type: pet.type || '',
          breed: pet.breed || '',
          age: pet.age || '',
          gender: pet.gender || '',
          size: pet.size || '',
          color: pet.color || '',
          temperament: pet.temperament || '',
          description: pet.description || '',
          status: pet.status || 'perdido',
          location: pet.location || '',
          contact_whatsapp: pet.contact_whatsapp || '',
          is_vaccinated: pet.is_vaccinated || false,
          is_neutered: pet.is_neutered || false,
          accepts_children: pet.accepts_children || false,
          accepts_other_animals: pet.accepts_other_animals || false
        });
        
        // Prepare images data for display
        let allImages = [];
        if (pet.main_image_url) {
          allImages.push({ id: 'main', url: pet.main_image_url });
        }
        
        if (images && images.length > 0) {
          const additionalImgs = images.map(img => ({ id: img.id, url: img.image_url }));
          allImages = [...allImages, ...additionalImgs];
        }
        
        setCurrentImages(allImages);
      } catch (error) {
        console.error('Error fetching pet data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do pet. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPetData();
  }, [id, user, navigate, toast]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPetData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSwitchChange = (field: string, checked: boolean) => {
    setPetData(prev => ({ ...prev, [field]: checked }));
  };
  
  const handleImageDelete = async (imageId: string) => {
    if (!id) return;
    
    try {
      if (imageId === 'main') {
        // Update pet record to remove main image
        await supabase
          .from('pets')
          .update({ main_image_url: null })
          .eq('id', id);
      } else {
        // Delete from pet_images
        await supabase
          .from('pet_images')
          .delete()
          .eq('id', imageId);
      }
      
      // Update UI
      setCurrentImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso."
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a imagem.",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    
    setIsSaving(true);
    
    try {
      // Handle image uploads if any
      let mainImageUrl = null;
      let additionalImageUrls: string[] = [];
      
      // Upload main image if provided
      if (mainImage) {
        const uploadedUrls = await uploadMultipleImages([mainImage]);
        if (uploadedUrls.length > 0) {
          mainImageUrl = uploadedUrls[0];
        }
      }
      
      // Upload additional images if provided
      if (additionalImages && additionalImages.length > 0) {
        additionalImageUrls = await uploadMultipleImages(additionalImages);
      }
      
      // Update pet data
      const updateData: any = { ...petData };
      
      // Only update main_image_url if a new image was uploaded
      if (mainImageUrl) {
        updateData.main_image_url = mainImageUrl;
      }
      
      const { error: updateError } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      // Add additional images if any
      if (additionalImageUrls.length > 0) {
        const imageRecords = additionalImageUrls.map(url => ({
          pet_id: id,
          image_url: url
        }));
        
        const { error: imagesError } = await supabase
          .from('pet_images')
          .insert(imageRecords);
          
        if (imagesError) throw imagesError;
      }
      
      toast({
        title: "Sucesso",
        description: "Os dados do pet foram atualizados com sucesso."
      });
      
      // Redirect to pet detail
      navigate(`/pet/${id}`);
    } catch (error) {
      console.error('Error updating pet:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o pet. Tente novamente mais tarde.",
        variant: "destructive"
      });
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
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="mb-4 flex items-center text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Editar Pet</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nome do Pet</Label>
            <Input 
              id="name" 
              value={petData.name} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={petData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perdido">Perdido</SelectItem>
                <SelectItem value="encontrado">Encontrado</SelectItem>
                <SelectItem value="adocao">Para Adoção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type">Tipo de Pet</Label>
            <Input 
              id="type" 
              placeholder="Ex: Cachorro, Gato" 
              value={petData.type}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="breed">Raça</Label>
            <Input 
              id="breed" 
              placeholder="Ex: SRD, Labrador" 
              value={petData.breed}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input 
              id="age" 
              placeholder="Ex: 2 anos" 
              value={petData.age}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Gênero</Label>
            <Select 
              value={petData.gender} 
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Macho">Macho</SelectItem>
                <SelectItem value="Fêmea">Fêmea</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="size">Porte</Label>
            <Select 
              value={petData.size} 
              onValueChange={(value) => handleSelectChange('size', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pequeno">Pequeno</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Grande">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="color">Cor</Label>
            <Input 
              id="color" 
              placeholder="Ex: Preto, Caramelo" 
              value={petData.color}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="temperament">Temperamento</Label>
            <Input 
              id="temperament" 
              placeholder="Ex: Dócil, Brincalhão" 
              value={petData.temperament}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            rows={3} 
            value={petData.description}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="location">Localização</Label>
          <Input 
            id="location" 
            value={petData.location}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contact_whatsapp">Contato (WhatsApp)</Label>
          <Input 
            id="contact_whatsapp" 
            value={petData.contact_whatsapp}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Características</h3>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_vaccinated"
              checked={petData.is_vaccinated}
              onCheckedChange={(checked) => handleSwitchChange('is_vaccinated', checked)}
            />
            <Label htmlFor="is_vaccinated">Vacinado</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_neutered"
              checked={petData.is_neutered}
              onCheckedChange={(checked) => handleSwitchChange('is_neutered', checked)}
            />
            <Label htmlFor="is_neutered">Castrado</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="accepts_children"
              checked={petData.accepts_children}
              onCheckedChange={(checked) => handleSwitchChange('accepts_children', checked)}
            />
            <Label htmlFor="accepts_children">Aceita crianças</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="accepts_other_animals"
              checked={petData.accepts_other_animals}
              onCheckedChange={(checked) => handleSwitchChange('accepts_other_animals', checked)}
            />
            <Label htmlFor="accepts_other_animals">Aceita outros animais</Label>
          </div>
        </div>
        
        {/* Current Images Section */}
        <div>
          <Label className="block mb-2">Imagens atuais</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentImages.map((image) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.url} 
                  alt="Pet" 
                  className="h-32 w-full object-cover rounded-lg border" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleImageDelete(image.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            {currentImages.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-4">Nenhuma imagem disponível</p>
            )}
          </div>
        </div>
        
        {/* New Images Section */}
        <div>
          <Label>Alterar imagem principal</Label>
          <MediaUpload
            id="main-image"
            label=""
            accept="image/*"
            multiple={false}
            onChange={(files) => setMainImage(files && files.length > 0 ? files[0] : null)}
            value={mainImage ? [mainImage] : null}
          />
        </div>
        
        <div>
          <Label>Adicionar mais imagens</Label>
          <MediaUpload
            id="additional-images"
            label=""
            accept="image/*"
            multiple={true}
            onChange={setAdditionalImages}
            value={additionalImages}
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

export default PetEditForm;
