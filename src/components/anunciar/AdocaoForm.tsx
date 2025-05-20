
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';

const AdocaoForm = ({ onSubmit }: { onSubmit: (event: React.FormEvent) => void }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select required>
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
        <Input id="nome" placeholder="Digite o nome do pet" required />
      </div>

      <div>
        <Label htmlFor="tipo">Tipo de Pet</Label>
        <Input id="tipo" placeholder="Ex: Cachorro, Gato, etc." required />
      </div>

      <div>
        <Label htmlFor="raca">Raça</Label>
        <Input id="raca" placeholder="Digite a raça do pet" required />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idade">Idade</Label>
          <Input id="idade" placeholder="Ex: 2 anos" required />
        </div>
        
        <div>
          <Label htmlFor="genero">Gênero</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="macho">Macho</SelectItem>
              <SelectItem value="femea">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="porte">Porte</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o porte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pequeno">Pequeno</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="grande">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="temperamento">Temperamento</Label>
        <Input id="temperamento" placeholder="Ex: Dócil, Brincalhão, etc." required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="castrado" />
          <Label htmlFor="castrado">Castrado?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="vacinas" />
          <Label htmlFor="vacinas">Vacinas em dia?</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="criancas" />
          <Label htmlFor="criancas">Pode com crianças?</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="animais" />
          <Label htmlFor="animais">Pode com outros animais?</Label>
        </div>
      </div>
      
      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" placeholder="(00) 00000-0000" required />
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea id="observacoes" placeholder="Compartilhe informações importantes sobre o pet" rows={3} />
      </div>

      <div>
        <Label htmlFor="imagens">Imagens</Label>
        <Input id="imagens" type="file" accept="image/*" multiple required />
      </div>

      <div>
        <Label htmlFor="video">Vídeo (opcional)</Label>
        <Input id="video" type="file" accept="video/*" />
      </div>
      
      <div>
        <Label htmlFor="localizacao">Localização</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input id="localizacao" placeholder="Digite sua cidade/estado" required />
          </div>
          <Button type="button" variant="outline" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Usar localização atual
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
        Publicar Anúncio de Adoção
      </Button>
    </form>
  );
};

export default AdocaoForm;
