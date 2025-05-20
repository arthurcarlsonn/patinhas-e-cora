
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin } from 'lucide-react';

const Anunciar = () => {
  const { toast } = useToast();
  const [anuncioTipo, setAnuncioTipo] = useState('adocao');
  
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

            <Tabs defaultValue="adocao" onValueChange={setAnuncioTipo} className="mb-8">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="adocao">Adoção de Pets</TabsTrigger>
                <TabsTrigger value="perdido">Pet Perdido</TabsTrigger>
                <TabsTrigger value="ong">ONG/Voluntário</TabsTrigger>
                <TabsTrigger value="produto">Produtos e Serviços</TabsTrigger>
              </TabsList>
              
              {/* Tab de Adoção de Pets */}
              <TabsContent value="adocao">
                <form onSubmit={handleSubmit} className="space-y-6">
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
              </TabsContent>
              
              {/* Tab de Pet Perdido */}
              <TabsContent value="perdido">
                <form onSubmit={handleSubmit} className="space-y-6">
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
              </TabsContent>
              
              {/* Tab de ONG/Voluntário */}
              <TabsContent value="ong">
                <form onSubmit={handleSubmit} className="space-y-6">
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
              </TabsContent>
              
              {/* Tab de Produtos e Serviços */}
              <TabsContent value="produto">
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
