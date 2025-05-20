
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CadastrarPet = () => {
  const { toast } = useToast();
  const [petType, setPetType] = useState<'perdido' | 'adocao'>('perdido');
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Pet cadastrado com sucesso!",
      description: "Obrigado por usar nosso serviço.",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-pet-darkPurple">Cadastrar Pet</h1>
            
            <div className="mb-8">
              <RadioGroup 
                defaultValue={petType} 
                onValueChange={(value) => setPetType(value as 'perdido' | 'adocao')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perdido" id="perdido" />
                  <Label htmlFor="perdido" className="font-medium">Pet Perdido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adocao" id="adocao" />
                  <Label htmlFor="adocao" className="font-medium">Pet para Adoção</Label>
                </div>
              </RadioGroup>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nome">Nome do Pet</Label>
                <Input 
                  id="nome" 
                  placeholder="Digite o nome do pet" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Pet</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de pet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cachorro">Cachorro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="ave">Ave</SelectItem>
                    <SelectItem value="roedor">Roedor</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="localizacao">Localização</Label>
                <Input 
                  id="localizacao" 
                  placeholder="Cidade, Estado" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="foto">Foto do Pet</Label>
                <Input 
                  id="foto" 
                  type="file" 
                  accept="image/*" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva características do pet, como ele foi perdido ou outras informações relevantes" 
                  rows={5}
                />
              </div>
              
              <div>
                <Label htmlFor="contato">Contato</Label>
                <Input 
                  id="contato" 
                  placeholder="Telefone ou email para contato" 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                Cadastrar Pet
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CadastrarPet;
