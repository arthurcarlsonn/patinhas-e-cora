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

interface PerdidoFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

const PerdidoForm = ({ onSubmit: parentOnSubmit }: PerdidoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    categoria: '',
    nome: '',
    tipo: '',
    raca: '',
    idade: '',
    genero: '',
    porte: '',
    cor: '',
    data: '',
    whatsapp: '',
    observacoes: '',
    localizacao: ''
  });

  const [images, setImages] = useState<File[] | null>(null);
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
        description: "Você precisa estar logado para cadastrar um pet perdido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determinar o status do pet com base na categoria
      let status;
      switch(formData.categoria) {
        case 'perdido': 
          status = 'perdido';
          break;
        case 'encontrado':
          status = 'encontrado';
          break;
        case 'avistado':
          status = 'avistado';
          break;
        default:
          status = 'perdido';
      }

      // Upload das imagens
      let mainImageUrl = null;
      let additionalImageUrls: string[] = [];
      
      if (images && images.length > 0) {
        const uploadedUrls = await uploadMultipleImages(images);
        mainImageUrl = uploadedUrls[0];
        additionalImageUrls = uploadedUrls.slice(1);
      }

      // Inserir pet no banco de dados
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: formData.nome,
          type: formData.tipo,
          breed: formData.raca,
          age: formData.idade,
          gender: formData.genero,
          size: formData.porte,
          color: formData.cor,
          status: status,
          description: `Data: ${formData.data}\n${formData.observacoes}`,
          contact_whatsapp: formData.whatsapp,
          location: formData.localizacao,
          main_image_url: mainImageUrl
        })
        .select()
        .single();

      if (petError) {
        throw petError;
      }

      // Inserir imagens adicionais
      if (additionalImageUrls.length > 0 && petData) {
        const petImagesData = additionalImageUrls.map(url => ({
          pet_id: petData.id,
          image_url: url
        }));

        const { error: imagesError } = await supabase
          .from('pet_images')
          .insert(petImagesData);

        if (imagesError) {
          console.error('Erro ao adicionar imagens:', imagesError);
        }
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Seu anúncio de pet ${status} foi publicado.`,
      });

      // Limpar formulário
      setFormData({
        categoria: '',
        nome: '',
        tipo: '',
        raca: '',
        idade: '',
        genero: '',
        porte: '',
        cor: '',
        data: '',
        whatsapp: '',
        observacoes: '',
        localizacao: ''
      });
      setImages(null);
      setVideo(null);

      // Chamar o callback do componente pai
      parentOnSubmit(e);
      
    } catch (error) {
      console.error('Erro ao cadastrar pet perdido:', error);
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
            <SelectItem value="perdido">Pet Perdido</SelectItem>
            <SelectItem value="encontrado">Pet Encontrado</SelectItem>
            <SelectItem value="avistado">Pet Avistado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="nome">Nome do Pet</Label>
        <Input 
          id="nome" 
          placeholder="Digite o nome do pet" 
          value={formData.nome}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="tipo">Tipo de Pet</Label>
        <Input 
          id="tipo" 
          placeholder="Ex: Cachorro, Gato, etc." 
          value={formData.tipo}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="raca">Raça</Label>
        <Input 
          id="raca" 
          placeholder="Digite a raça do pet" 
          value={formData.raca}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idade">Idade</Label>
          <Input 
            id="idade" 
            placeholder="Ex: 2 anos" 
            value={formData.idade}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="genero">Gênero</Label>
          <Select 
            value={formData.genero} 
            onValueChange={(value) => handleSelectChange('genero', value)}
            required
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
      </div>
      
      <div>
        <Label htmlFor="porte">Porte</Label>
        <Select 
          value={formData.porte} 
          onValueChange={(value) => handleSelectChange('porte', value)}
          required
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
      
      <div>
        <Label htmlFor="cor">Cor Principal</Label>
        <Input 
          id="cor" 
          placeholder="Ex: Preto, Branco, Caramelo" 
          value={formData.cor}
          onChange={handleInputChange}
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="data">Data do Desaparecimento</Label>
        <Input 
          id="data" 
          type="date" 
          value={formData.data}
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
      
      <div>
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea 
          id="observacoes" 
          placeholder="Compartilhe detalhes que possam ajudar a identificar o pet" 
          rows={3}
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
        />
      </div>
      
      <MediaUpload
        id="imagens"
        label="Fotos do Pet"
        accept="image/*"
        multiple={true}
        onChange={setImages}
        value={images}
        required={true}
      />

      <MediaUpload
        id="video"
        label="Vídeo do Pet (opcional)" 
        accept="video/*"
        multiple={false}
        onChange={(files) => files && files.length > 0 ? setVideo(files[0]) : setVideo(null)}
        value={video ? [video] : null}
      />
      
      <div>
        <Label htmlFor="localizacao">Localização onde foi visto pela última vez</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input 
              id="localizacao" 
              placeholder="Digite endereço/bairro/cidade" 
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
          'Publicar Anúncio de Pet Perdido'
        )}
      </Button>
    </form>
  );
};

export default PerdidoForm;
