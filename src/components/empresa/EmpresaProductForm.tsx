
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImage } from '@/utils/uploadUtils';
import MediaUpload from '@/components/MediaUpload';

interface EmpresaProductFormProps {
  companyProducts?: any[];
  setCompanyProducts?: (products: any[]) => void;
  onProductAdded?: () => void;
}

const EmpresaProductForm = ({ 
  companyProducts = [], 
  setCompanyProducts, 
  onProductAdded 
}: EmpresaProductFormProps) => {
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
    localizacao: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoria: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, domicilio: checked }));
  };
  
  const handleFileChange = (files: FileList | null) => {
    setSelectedFiles(files);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um produto.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload da imagem principal
      let mainImageUrl = '';
      
      if (selectedFiles && selectedFiles.length > 0) {
        mainImageUrl = await uploadImage(selectedFiles[0]);
        
        if (!mainImageUrl) {
          throw new Error('Falha ao fazer upload da imagem');
        }
      }
      
      // Cadastrar produto no Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            user_id: user.id,
            title: formData.titulo,
            description: formData.descricao,
            category: formData.categoria,
            price: parseFloat(formData.preco),
            home_delivery: formData.domicilio,
            contact: formData.contatos,
            social_media: formData.redesSociais ? JSON.parse(`{"social": "${formData.redesSociais}"}`) : {},
            website: formData.site,
            location: formData.localizacao,
            main_image_url: mainImageUrl,
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Produto cadastrado com sucesso!",
        description: "Seu anúncio será publicado em breve.",
      });
      
      // Resetar formulário
      setFormData({
        categoria: '',
        titulo: '',
        descricao: '',
        preco: '',
        domicilio: false,
        contatos: '',
        redesSociais: '',
        site: '',
        localizacao: '',
      });
      setSelectedFiles(null);
      
      // Atualizar a lista de produtos se a função setCompanyProducts estiver disponível
      if (data && setCompanyProducts) {
        setCompanyProducts([...companyProducts, data[0]]);
      }
      
      // Chama callback se fornecido
      if (onProductAdded) {
        onProductAdded();
      }
      
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Cadastrar Produto ou Serviço</h2>
        <Button className="bg-pet-purple hover:bg-pet-lightPurple">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select 
            required
            value={formData.categoria}
            onValueChange={handleSelectChange}
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
            onChange={handleInputChange}
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
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="domicilio">Atendimento a domicílio?</Label>
        </div>
        
        <MediaUpload
          id="imagens"
          label="Imagens do Produto"
          accept="image/*"
          multiple={true}
          onChange={handleFileChange}
          value={selectedFiles}
          required={true}
        />
        
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
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    // Em uma aplicação real, aqui você converteria as coordenadas em um endereço usando um serviço de geocodificação
                    setFormData(prev => ({ 
                      ...prev, 
                      localizacao: "Localização atual (use um serviço de geocodificação em produção)" 
                    }));
                  });
                }
              }}
            >
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
          {isSubmitting ? "Publicando..." : "Publicar Anúncio de Produto/Serviço"}
        </Button>
      </form>
    </div>
  );
};

export default EmpresaProductForm;
