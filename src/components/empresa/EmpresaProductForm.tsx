import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCardProps } from '@/components/ProductCard';
import MediaUpload from '@/components/MediaUpload';
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface EmpresaProductFormProps {
  companyProducts: ProductCardProps[];
  setCompanyProducts: (products: ProductCardProps[]) => void;
  onSubmitSuccess?: () => void;
}

const EmpresaProductForm = ({
  companyProducts,
  setCompanyProducts,
  onSubmitSuccess
}: EmpresaProductFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        description: "Você precisa estar logado para cadastrar um produto.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images
      let mainImageUrl = null;
      let additionalImageUrls: string[] = [];
      
      if (images && images.length > 0) {
        const uploadedUrls = await uploadMultipleImages(images);
        mainImageUrl = uploadedUrls[0];
        additionalImageUrls = uploadedUrls.slice(1);
      }

      // Process social media to JSON format
      const socialMediaObj = {};
      if (formData.socialMedia) {
        formData.socialMedia.split(',').forEach(item => {
          const [platform, handle] = item.split(':').map(s => s.trim());
          if (platform && handle) {
            socialMediaObj[platform.toLowerCase()] = handle;
          }
        });
      }

      // Insert product into database
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          home_delivery: formData.homeDelivery,
          main_image_url: mainImageUrl,
          contact: formData.contact,
          social_media: socialMediaObj,
          website: formData.website,
          location: formData.location
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // Insert additional images
      if (additionalImageUrls.length > 0 && productData) {
        const productImagesData = additionalImageUrls.map(url => ({
          product_id: productData.id,
          image_url: url
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(productImagesData);

        if (imagesError) {
          console.error('Erro ao adicionar imagens:', imagesError);
        }
      }

      // Add the new product to state with corrected properties
      const newProduct: ProductCardProps = {
        id: productData.id,
        title: productData.title,
        image: mainImageUrl || `https://via.placeholder.com/300x200?text=Produto`,
        price: Number(productData.price),
        category: productData.category,
        location: productData.location,
        views: 0,
        // Fix the business property according to ProductCardProps type
        business: {
          name: 'Sua Empresa',
          verified: true
        },
        // Adjust homeDelivery to match ProductCardProps if needed
      };

      setCompanyProducts([newProduct, ...companyProducts]);

      toast({
        title: "Produto cadastrado",
        description: "Seu produto foi cadastrado com sucesso.",
      });

      // Reset form
      setFormData({
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
      setImages(null);
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar seu produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Label htmlFor="homeDelivery">Oferece entrega a domicílio?</Label>
      </div>
      
      <MediaUpload
        id="imagens"
        label="Imagens do Produto"
        accept="image/*"
        multiple={true}
        onChange={setImages}
        value={images}
        required={true}
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
        <Label htmlFor="website">Website (opcional)</Label>
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
      
      <Button 
        type="submit" 
        className="w-full bg-pet-purple hover:bg-pet-lightPurple"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cadastrando...
          </>
        ) : (
          'Cadastrar Produto'
        )}
      </Button>
    </form>
  );
};

export default EmpresaProductForm;
