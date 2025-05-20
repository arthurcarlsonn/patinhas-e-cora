
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const PerdidoForm = ({ onSubmit }: { onSubmit: (event: React.FormEvent) => void }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select required>
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
        <Label htmlFor="cor">Cor Principal</Label>
        <Input id="cor" placeholder="Ex: Preto, Branco, Caramelo" required />
      </div>
      
      <div>
        <Label htmlFor="data">Data do Desaparecimento</Label>
        <Input id="data" type="date" required />
      </div>
      
      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" placeholder="(00) 00000-0000" required />
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea id="observacoes" placeholder="Compartilhe detalhes que possam ajudar a identificar o pet" rows={3} />
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
        <Label htmlFor="localizacao">Localização onde foi visto pela última vez</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input id="localizacao" placeholder="Digite endereço/bairro/cidade" required />
          </div>
          <Button type="button" variant="outline" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Usar localização atual
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
        Publicar Anúncio de Pet Perdido
      </Button>
    </form>
  );
};

export default PerdidoForm;
