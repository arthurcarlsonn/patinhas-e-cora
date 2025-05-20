
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
import { uploadMultipleImages } from '@/utils/uploadUtils';

interface ProdutoFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

const ProdutoForm = ({ onSubmit: parentOnSubmit }: ProdutoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    categoria: '',
    titulo: '',
    descricao: '',
    preco: '',
    domicilio: false,
    contatos: '',
    redesSociais: '',
    site: '',
    localizacao: ''
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: "Você precisa estar logado para cadastrar um produto ou serviço.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload das imagens
      let mainImageUrl = null;
      let additionalImageUrls: string[] = [];
      
      if (images && images.length > 0) {
        const uploadedUrls = await uploadMultipleImages(images);
        mainImageUrl = uploadedUrls[0];
        additionalImageUrls = uploadedUrls.slice(1);
      }

      // Processar redes sociais para formato JSON
      const socialMediaObj = {};
      if (formData.redesSociais) {
        formData.redesSociais.split(',').forEach(item => {
          const [platform, handle] = item.split(':').map(s => s.trim());
          if (platform && handle) {
            socialMediaObj[platform.toLowerCase()] = handle;
          }
        });
      }

      // Inserir produto no banco de dados
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: formData.titulo,
          category: formData.categoria,
          description: formData.descricao,
          price: parseFloat(formData.preco),
          home_delivery: formData.domicilio,
          main_image_url: mainImageUrl,
          contact: formData.contatos,
          social_media: socialMediaObj,
          website: formData.site,
          location: formData.localizacao
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // Inserir imagens adicionais
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

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu anúncio de produto/serviço foi publicado.",
      });

      // Limpar formulário
      setFormData({
        categoria: '',
        titulo: '',
        descricao: '',
        preco: '',
        domicilio: false,
        contatos: '',
        redesSociais: '',
        site: '',
        localizacao: ''
      });
      setImages(null);

      // Chamar o callback do componente pai
      parentOnSubmit(e);
      
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível publicar seu anúncio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select 
          value={formData.categoria} 
          onValueChange={(value) => handleSelectChange('categoria', value)}
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
        <Label htmlFor="titulo">Título</Label>
        <Input 
          id="titulo" 
          placeholder="Digite o título do anúncio" 
          value={formData.titulo}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea 
          id="descricao" 
          placeholder="Descreva o produto ou serviço detalhadamente" 
          rows={4}
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="preco">Preço (R$)</Label>
        <Input 
          id="preco" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="0,00" 
          value={formData.preco}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="domicilio" 
          checked={formData.domicilio}
          onCheckedChange={(checked) => handleSwitchChange('domicilio', checked)}
        />
        <Label htmlFor="domicilio">Atendimento a domicílio?</Label>
      </div>
      
      <div>
        <Label htmlFor="imagens">Imagens</Label>
        <Input 
          id="imagens" 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => setImages(e.target.files)}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="contatos">Contatos</Label>
        <Input 
          id="contatos" 
          placeholder="Telefone, WhatsApp, etc." 
          value={formData.contatos}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="redesSociais">Redes Sociais (opcional)</Label>
        <Input 
          id="redesSociais" 
          placeholder="Instagram: @exemplo, Facebook: /exemplo" 
          value={formData.redesSociais}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="site">Site (opcional)</Label>
        <Input 
          id="site" 
          placeholder="www.seusite.com.br" 
          value={formData.site}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="localizacao">Localização</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input 
              id="localizacao" 
              placeholder="Cidade, Estado" 
              value={formData.localizacao}
              onChange={handleInputChange}
              required 
            />
          </div>
          <Button type="button" variant="outline" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Usar localização atual
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-pet-purple hover:bg-pet-lightPurple"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publicando...
          </>
        ) : (
          'Publicar Anúncio de Produto/Serviço'
        )}
      </Button>
    </form>
  );
};

export default ProdutoForm;
