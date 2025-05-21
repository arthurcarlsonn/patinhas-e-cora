import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductCardProps } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface ProductEditFormProps {
  product: ProductCardProps;
  onCancel: () => void;
  onUpdate: (updatedProduct: ProductCardProps) => void;
}

const ProductEditForm = ({ product, onCancel, onUpdate }: ProductEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    contact: '',
    socialMedia: '',
    website: '',
    homeDelivery: false
  });
  
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Load the full product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', product.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title || '',
            category: data.category || '',
            description: data.description || '',
            price: data.price ? String(data.price) : '',
            location: data.location || '',
            contact: data.contact || '',
            socialMedia: formatSocialMediaForInput(data.social_media),
            website: data.website || '',
            homeDelivery: data.home_delivery || false
          });
          
          // Set main image
          if (data.main_image_url) {
            setExistingImages([data.main_image_url]);
          }
          
          // Fetch additional images
          const { data: productImages, error: imagesError } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id);
            
          if (!imagesError && productImages) {
            const allImages = [
              ...(data.main_image_url ? [data.main_image_url] : []),
              ...productImages.map(img => img.image_url)
            ];
            setExistingImages(allImages);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchProductDetails();
  }, [product.id, toast]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para atualizar um produto.",
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
      
      // Update product in database
      const { data: updatedProduct, error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          contact: formData.contact,
          social_media: socialMediaObj,
          website: formData.website,
          home_delivery: formData.homeDelivery,
          main_image_url: mainImageUrl, // Update main image if new images uploaded
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add any additional new images to product_images table
      if (uploadedImageUrls.length > 1) {
        const additionalImages = uploadedImageUrls.slice(1).map(url => ({
          product_id: product.id,
          image_url: url
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(additionalImages);
        
        if (imagesError) {
          console.error('Erro ao adicionar imagens adicionais:', imagesError);
        }
      }
      
      // Create updated product card data with correct properties
      const updatedProductCard: ProductCardProps = {
        ...product,
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        image: mainImageUrl || product.image,
      };
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
      
      // Call the parent component with updated data
      onUpdate(updatedProductCard);
      
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o produto. Tente novamente.",
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
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Editar Produto</h3>
      </div>
      
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alimentacao">Alimentação</SelectItem>
            <SelectItem value="acessorios">Acessórios</SelectItem>
            <SelectItem value="brinquedos">Brinquedos</SelectItem>
            <SelectItem value="higiene">Higiene e Limpeza</SelectItem>
            <SelectItem value="medicamentos">Medicamentos</SelectItem>
            <SelectItem value="servicos">Serviços Pet</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="title">Título</Label>
        <Input 
          id="title" 
          placeholder="Digite o título do produto" 
          value={formData.title}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          placeholder="Descreva o produto detalhadamente" 
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="price">Preço (R$)</Label>
        <Input 
          id="price" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="0,00" 
          value={formData.price}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="homeDelivery" 
          checked={formData.homeDelivery}
          onCheckedChange={(checked) => handleSwitchChange('homeDelivery', checked)}
        />
        <Label htmlFor="homeDelivery">Entrega a domicílio?</Label>
      </div>
      
      <MediaUpload
        id="imagens"
        label="Imagens do Produto"
        accept="image/*"
        multiple={true}
        onChange={setImages}
        value={images}
        existingUrls={existingImages}
      />
      
      <div>
        <Label htmlFor="contact">Contatos</Label>
        <Input 
          id="contact" 
          placeholder="Telefone, WhatsApp, etc." 
          value={formData.contact}
          onChange={handleInputChange}
          required 
        />
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
      
      <div>
        <Label htmlFor="website">Site (opcional)</Label>
        <Input 
          id="website" 
          placeholder="www.seusite.com.br" 
          value={formData.website}
          onChange={handleInputChange}
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

export default ProductEditForm;
