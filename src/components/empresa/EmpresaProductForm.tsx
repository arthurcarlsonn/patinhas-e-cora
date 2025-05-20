import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Update the component interface to accept companyProducts and setCompanyProducts
interface EmpresaProductFormProps {
  companyProducts?: any[];
  setCompanyProducts?: (products: any[]) => void;
}

const EmpresaProductForm = ({ companyProducts = [], setCompanyProducts }: EmpresaProductFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Produto cadastrado com sucesso!",
      description: "Seu anúncio será publicado em breve.",
    });
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
          <Select required>
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
          <Input id="titulo" placeholder="Digite o título do anúncio" required />
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea 
            id="descricao" 
            placeholder="Descreva o produto ou serviço detalhadamente" 
            rows={4}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input id="preco" type="number" step="0.01" min="0" placeholder="0,00" required />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="domicilio" />
          <Label htmlFor="domicilio">Atendimento a domicílio?</Label>
        </div>
        
        <div>
          <Label htmlFor="imagens">Imagens</Label>
          <Input id="imagens" type="file" accept="image/*" multiple required />
        </div>
        
        <div>
          <Label htmlFor="contatos">Contatos</Label>
          <Input id="contatos" placeholder="Telefone, WhatsApp, etc." required />
        </div>
        
        <div>
          <Label htmlFor="redesSociais">Redes Sociais (opcional)</Label>
          <Input id="redesSociais" placeholder="Instagram: @exemplo, Facebook: /exemplo" />
        </div>
        
        <div>
          <Label htmlFor="site">Site (opcional)</Label>
          <Input id="site" placeholder="www.seusite.com.br" />
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
        
        <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
          Publicar Anúncio de Produto/Serviço
        </Button>
      </form>
    </div>
  );
};

export default EmpresaProductForm;
