
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Anunciar = () => {
  const { toast } = useToast();
  const [anuncioTipo, setAnuncioTipo] = useState('produto');
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Anúncio cadastrado com sucesso!",
      description: "Seu anúncio será revisado e publicado em breve.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-pet-darkPurple">Anunciar</h1>

            <Tabs defaultValue="produto" onValueChange={setAnuncioTipo} className="mb-8">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="produto">Produto</TabsTrigger>
                <TabsTrigger value="ong">ONG/Voluntário</TabsTrigger>
                <TabsTrigger value="evento">Evento</TabsTrigger>
                <TabsTrigger value="clinica">Clínica/Veterinário</TabsTrigger>
              </TabsList>
              
              <TabsContent value="produto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="titulo">Título do Produto</Label>
                    <Input id="titulo" placeholder="Digite o título do produto" required />
                  </div>
                  
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
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input id="valor" type="number" step="0.01" min="0" placeholder="0,00" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input id="localizacao" placeholder="Cidade, Estado" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="foto">Foto do Produto</Label>
                    <Input id="foto" type="file" accept="image/*" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descreva o produto detalhadamente" 
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input id="contato" placeholder="Telefone ou email para contato" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    Publicar Anúncio
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="ong">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nome">Nome da ONG/Voluntário</Label>
                    <Input id="nome" placeholder="Digite o nome" required />
                  </div>
                  
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
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input id="localizacao" placeholder="Cidade, Estado" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="foto">Foto</Label>
                    <Input id="foto" type="file" accept="image/*" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descreva o trabalho realizado" 
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input id="contato" placeholder="Telefone ou email para contato" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    Publicar Anúncio
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="evento">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="titulo">Título do Evento</Label>
                    <Input id="titulo" placeholder="Digite o título do evento" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adocao">Feira de Adoção</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="educacao">Educação e Treinamento</SelectItem>
                        <SelectItem value="lazer">Lazer</SelectItem>
                        <SelectItem value="arrecadacao">Arrecadação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="data">Data do Evento</Label>
                    <Input id="data" type="date" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input id="localizacao" placeholder="Endereço completo do evento" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="foto">Foto do Evento</Label>
                    <Input id="foto" type="file" accept="image/*" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descreva o evento detalhadamente" 
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input id="contato" placeholder="Telefone ou email para contato" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    Publicar Evento
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="clinica">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nome">Nome da Clínica/Veterinário</Label>
                    <Input id="nome" placeholder="Digite o nome" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinica">Clínica Veterinária</SelectItem>
                        <SelectItem value="hospital">Hospital Veterinário</SelectItem>
                        <SelectItem value="veterinario">Veterinário Autônomo</SelectItem>
                        <SelectItem value="petshop">Pet Shop com Atendimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input id="localizacao" placeholder="Endereço completo" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="foto">Foto</Label>
                    <Input id="foto" type="file" accept="image/*" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descreva os serviços oferecidos" 
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input id="contato" placeholder="Telefone ou email para contato" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    Publicar Anúncio
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Anunciar;
