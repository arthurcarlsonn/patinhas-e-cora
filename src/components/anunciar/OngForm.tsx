
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const OngForm = ({ onSubmit }: { onSubmit: (event: React.FormEvent) => void }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Select required>
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
        <Input id="nome" placeholder="Digite o nome" required />
      </div>
      
      <div>
        <Label htmlFor="areaAtuacao">Área de Atuação</Label>
        <Select required>
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
        <Input id="whatsapp" placeholder="(00) 00000-0000" required />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contato@exemplo.com" required />
      </div>
      
      <div>
        <Label htmlFor="site">Site (opcional)</Label>
        <Input id="site" placeholder="www.seusite.com.br" />
      </div>
      
      <div>
        <Label htmlFor="redesSociais">Redes Sociais (opcional)</Label>
        <Input id="redesSociais" placeholder="Instagram: @exemplo, Facebook: /exemplo" />
      </div>
      
      <div>
        <Label htmlFor="localizacao">Localização</Label>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input id="localizacao" placeholder="Cidade, Estado" required />
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
          required
        />
      </div>
      
      <div>
        <Label htmlFor="imagens">Imagens</Label>
        <Input id="imagens" type="file" accept="image/*" multiple required />
      </div>
      
      <div>
        <Label htmlFor="video">Vídeo (opcional)</Label>
        <Input id="video" type="file" accept="video/*" />
      </div>
      
      <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
        Publicar Anúncio de ONG/Voluntário
      </Button>
    </form>
  );
};

export default OngForm;
