
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

interface AdocaoFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

const AdocaoForm = ({ onSubmit: parentOnSubmit }: AdocaoFormProps) => {
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
    temperamento: '',
    castrado: false,
    vacinas: false,
    criancas: false,
    animais: false,
    whatsapp: '',
    observacoes: '',
    localizacao: ''
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para cadastrar um pet.",
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
          temperament: formData.temperamento,
          is_neutered: formData.castrado,
          is_vaccinated: formData.vacinas,
          accepts_children: formData.criancas,
          accepts_other_animals: formData.animais,
          status: 'adocao',
          description: formData.observacoes,
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
        description: "Seu anúncio de pet para adoção foi publicado.",
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
        temperamento: '',
        castrado: false,
        vacinas: false,
        criancas: false,
        animais: false,
        whatsapp: '',
        observacoes: '',
        localizacao: ''
      });
      setImages(null);
      setVideo(null);

      // Chamar o callback do componente pai
      parentOnSubmit(e);
      
    } catch (error) {
      console.error('Erro ao cadastrar pet:', error);
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
            <SelectItem value="cachorro">Cachorro</SelectItem>
            <SelectItem value="gato">Gato</SelectItem>
            <SelectItem value="ave">Ave</SelectItem>
            <SelectItem value="roedor">Roedor</SelectItem>
            <SelectItem value="reptil">Réptil</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
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
        <Label htmlFor="temperamento">Temperamento</Label>
        <Input 
          id="temperamento" 
          placeholder="Ex: Dócil, Brincalhão, etc." 
          value={formData.temperamento}
          onChange={handleInputChange}
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="castrado" 
            checked={formData.castrado}
            onCheckedChange={(checked) => handleSwitchChange('castrado', checked)}
          />
          <Label htmlFor="castrado">Castrado?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="vacinas" 
            checked={formData.vacinas}
            onCheckedChange={(checked) => handleSwitchChange('vacinas', checked)}
          />
          <Label htmlFor="vacinas">Vacinas em dia?</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="criancas" 
            checked={formData.criancas}
            onCheckedChange={(checked) => handleSwitchChange('criancas', checked)}
          />
          <Label htmlFor="criancas">Pode com crianças?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="animais" 
            checked={formData.animais}
            onCheckedChange={(checked) => handleSwitchChange('animais', checked)}
          />
          <Label htmlFor="animais">Pode com outros animais?</Label>
        </div>
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
          placeholder="Compartilhe informações importantes sobre o pet" 
          rows={3}
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
        />
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
        <Label htmlFor="video">Vídeo (opcional)</Label>
        <Input 
          id="video" 
          type="file" 
          accept="video/*"
          onChange={(e) => e.target.files && setVideo(e.target.files[0])} 
        />
      </div>
      
      <div>
        <Label htmlFor="localizacao">Localização</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input 
              id="localizacao" 
              placeholder="Digite sua cidade/estado" 
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
          'Publicar Anúncio de Adoção'
        )}
      </Button>
    </form>
  );
};

export default AdocaoForm;
