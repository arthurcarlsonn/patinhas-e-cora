import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleImages } from '@/utils/uploadUtils';
import MediaUpload from '@/components/MediaUpload';

interface OngFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

const OngForm = ({ onSubmit: parentOnSubmit }: OngFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    categoria: '',
    nome: '',
    areaAtuacao: '',
    whatsapp: '',
    email: '',
    site: '',
    redesSociais: '',
    localizacao: '',
    descricao: ''
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar uma ONG ou voluntário.",
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

      // Inserir ONG no banco de dados
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          user_id: user.id,
          name: formData.nome,
          type: formData.categoria,
          action_area: formData.areaAtuacao,
          whatsapp: formData.whatsapp,
          email: formData.email,
          website: formData.site,
          social_media: socialMediaObj,
          location: formData.localizacao,
          description: formData.descricao,
          main_image_url: mainImageUrl
        })
        .select()
        .single();

      if (orgError) {
        throw orgError;
      }

      // Inserir imagens adicionais
      if (additionalImageUrls.length > 0 && orgData) {
        const orgImagesData = additionalImageUrls.map(url => ({
          organization_id: orgData.id,
          image_url: url
        }));

        const { error: imagesError } = await supabase
          .from('organization_images')
          .insert(orgImagesData);

        if (imagesError) {
          console.error('Erro ao adicionar imagens:', imagesError);
        }
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu anúncio de ONG/voluntário foi publicado.",
      });

      // Limpar formulário
      setFormData({
        categoria: '',
        nome: '',
        areaAtuacao: '',
        whatsapp: '',
        email: '',
        site: '',
        redesSociais: '',
        localizacao: '',
        descricao: ''
      });
      setImages(null);
      setVideo(null);

      // Chamar o callback do componente pai
      parentOnSubmit(e);
      
    } catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
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
            <SelectItem value="ong">ONG</SelectItem>
            <SelectItem value="voluntario">Voluntário</SelectItem>
            <SelectItem value="abrigo">Abrigo</SelectItem>
            <SelectItem value="protetor">Protetor Independente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="nome">Nome da ONG/Voluntário</Label>
        <Input 
          id="nome" 
          placeholder="Digite o nome" 
          value={formData.nome}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="areaAtuacao">Área de Atuação</Label>
        <Select 
          value={formData.areaAtuacao} 
          onValueChange={(value) => handleSelectChange('areaAtuacao', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resgate">Resgate</SelectItem>
            <SelectItem value="adocao">Adoção</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="alimentacao">Alimentação</SelectItem>
            <SelectItem value="castracao">Castração</SelectItem>
            <SelectItem value="educacao">Educação</SelectItem>
            <SelectItem value="multipla">Múltiplas áreas</SelectItem>
          </SelectContent>
        </Select>
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
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="contato@exemplo.com" 
          value={formData.email}
          onChange={handleInputChange}
          required 
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
        <Label htmlFor="redesSociais">Redes Sociais (opcional)</Label>
        <Input 
          id="redesSociais" 
          placeholder="Instagram: @exemplo, Facebook: /exemplo" 
          value={formData.redesSociais}
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
      
      <div>
        <Label htmlFor="descricao">Descrição do Trabalho</Label>
        <Textarea 
          id="descricao" 
          placeholder="Descreva o trabalho realizado" 
          rows={4}
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          required 
        />
      </div>
      
      <MediaUpload
        id="imagens"
        label="Imagens da ONG/Voluntário"
        accept="image/*"
        multiple={true}
        onChange={setImages}
        value={images}
        required={true}
      />
      
      <MediaUpload
        id="video"
        label="Vídeo (opcional)"
        accept="video/*"
        multiple={false}
        onChange={(files) => files && files.length > 0 ? setVideo(files[0]) : setVideo(null)}
        value={video ? new DataTransfer().files : null}
      />
      
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
          'Publicar Anúncio de ONG/Voluntário'
        )}
      </Button>
    </form>
  );
};

export default OngForm;
