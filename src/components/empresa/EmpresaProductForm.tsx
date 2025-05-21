
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

interface EmpresaProductFormProps {
  onSuccess: () => void;
}

interface Company {
  id: string;
  company_name: string;
  email?: string;
}

const EmpresaProductForm = ({ onSuccess }: EmpresaProductFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    contact: '',
    website: '',
    socialMedia: '',
    homeDelivery: false
  });
  
  const [productImages, setProductImages] = useState<File[] | null>(null);
  
  useEffect(() => {
    const getUserCompany = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name, email')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCompany(data);
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
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, homeDelivery: checked }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para cadastrar um produto');
      return;
    }
    
    if (!company) {
      toast.error('Não foi possível identificar sua empresa');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload images
      let mainImageUrl = null;
      let additionalImageUrls: string[] = [];
      
      if (productImages && productImages.length > 0) {
        const uploadedUrls = await uploadMultipleImages(productImages);
        
        if (uploadedUrls.length > 0) {
          mainImageUrl = uploadedUrls[0];
          if (uploadedUrls.length > 1) {
            additionalImageUrls = uploadedUrls.slice(1);
          }
        }
      }
      
      // Process social media
      const socialMediaObj: Record<string, string> = {};
      if (formData.socialMedia) {
        formData.socialMedia.split(',').forEach(item => {
          const [platform, handle] = item.split(':').map(s => s.trim());
          if (platform && handle) {
            socialMediaObj[platform.toLowerCase()] = handle;
          }
        });
      }
      
      // Insert product
      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          location: formData.location,
          contact: formData.contact,
          website: formData.website || null,
          social_media: Object.keys(socialMediaObj).length > 0 ? socialMediaObj : null,
          home_delivery: formData.homeDelivery,
          main_image_url: mainImageUrl,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add additional images if any
      if (additionalImageUrls.length > 0 && insertedProduct) {
        const productImagesData = additionalImageUrls.map(url => ({
          product_id: insertedProduct.id,
          image_url: url
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(productImagesData);
        
        if (imagesError) {
          console.error('Erro ao adicionar imagens adicionais:', imagesError);
        }
      }
      
      toast.success('Produto cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        contact: '',
        website: '',
        socialMedia: '',
        homeDelivery: false
      });
      setProductImages(null);
      
      // Notify parent component
      onSuccess();
      
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      toast.error(error.message || 'Erro ao cadastrar produto. Tente novamente.');
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
        <Label htmlFor="title">Nome do Produto/Serviço</Label>
        <Input 
          id="title" 
          placeholder="Ex: Ração Premium para Cães Adultos" 
          value={formData.title}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          placeholder="Descreva o produto em detalhes" 
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
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="homeDelivery">Entrega a domicílio?</Label>
      </div>
      
      <div>
        <Label htmlFor="productImage">Imagens do Produto</Label>
        <MediaUpload
          id="productImage"
          label="Selecione até 5 imagens"
          accept="image/*"
          multiple={true}
          onChange={setProductImages}
          value={productImages}
          maxFiles={5}
        />
      </div>
      
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
        <p className="text-xs text-gray-500 mt-1">
          Formato: plataforma: nome, separados por vírgula
        </p>
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
          'Cadastrar Produto'
        )}
      </Button>
    </form>
  );
};

export default EmpresaProductForm;
