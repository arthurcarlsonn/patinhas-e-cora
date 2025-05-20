
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, PlusCircle, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImage } from '@/utils/uploadUtils';
import { ClinicCardProps } from '@/components/ClinicCard';

interface EmpresaClinicFormProps {
  companyClinics?: ClinicCardProps[];
  setCompanyClinics?: (clinics: ClinicCardProps[]) => void;
  onClinicAdded?: () => void;
}

const EmpresaClinicForm = ({ 
  companyClinics = [], 
  setCompanyClinics,
  onClinicAdded
}: EmpresaClinicFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    categoria: '',
    nome: '',
    descricao: '',
    atendimentoDomicilio: false,
    estacionamento: false, 
    horarioAtendimento: '',
    especialidades: '',
    servicos: '',
    contatos: '',
    whatsapp: '',
    email: '',
    site: '',
    localizacao: '',
    endereco: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoria: value }));
  };

  const handleHomeServiceChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, atendimentoDomicilio: checked }));
  };

  const handleParkingChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, estacionamento: checked }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar uma clínica.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload da imagem principal
      let mainImageUrl = '';
      
      if (selectedFiles && selectedFiles.length > 0) {
        mainImageUrl = await uploadImage(selectedFiles[0]);
        
        if (!mainImageUrl) {
          throw new Error('Falha ao fazer upload da imagem');
        }
      }

      // Converte especialidades e serviços em arrays
      const specialties = formData.especialidades
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      const services = formData.servicos
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Cadastrar clínica no Supabase
      const { data, error } = await supabase
        .from('clinics')
        .insert([
          {
            user_id: user.id,
            name: formData.nome,
            description: formData.descricao,
            category: formData.categoria,
            has_home_service: formData.atendimentoDomicilio,
            has_parking: formData.estacionamento,
            open_hours: formData.horarioAtendimento,
            specialties: specialties,
            services: services,
            phone: formData.contatos,
            whatsapp: formData.whatsapp,
            email: formData.email,
            website: formData.site,
            location: formData.localizacao,
            address: formData.endereco,
            main_image_url: mainImageUrl,
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Clínica cadastrada com sucesso!",
        description: "Sua clínica será publicada em breve.",
      });
      
      // Resetar formulário
      setFormData({
        categoria: '',
        nome: '',
        descricao: '',
        atendimentoDomicilio: false,
        estacionamento: false,
        horarioAtendimento: '',
        especialidades: '',
        servicos: '',
        contatos: '',
        whatsapp: '',
        email: '',
        site: '',
        localizacao: '',
        endereco: '',
      });
      setSelectedFiles(null);
      
      // Atualizar a lista de clínicas se a função setCompanyClinics estiver disponível
      if (data && setCompanyClinics) {
        const newClinic: ClinicCardProps = {
          id: data[0].id,
          name: data[0].name,
          image: data[0].main_image_url || `https://via.placeholder.com/300x200?text=Clínica`,
          location: data[0].location,
          category: data[0].category,
          views: 0
        };
        
        setCompanyClinics([...companyClinics, newClinic]);
      }
      
      // Chama callback se fornecido
      if (onClinicAdded) {
        onClinicAdded();
      }
      
    } catch (error: any) {
      console.error('Erro ao cadastrar clínica:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a clínica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Cadastrar Clínica ou Serviço Veterinário</h2>
        <Button className="bg-pet-purple hover:bg-pet-lightPurple">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Clínica
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select 
            required
            value={formData.categoria}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clinica">Clínica Veterinária</SelectItem>
              <SelectItem value="hospital">Hospital Veterinário</SelectItem>
              <SelectItem value="petshop">Pet Shop com Serviços Veterinários</SelectItem>
              <SelectItem value="especialidade">Clínica Especializada</SelectItem>
              <SelectItem value="outros">Outros Serviços Veterinários</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="nome">Nome da Clínica</Label>
          <Input 
            id="nome" 
            placeholder="Digite o nome da clínica" 
            value={formData.nome}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea 
            id="descricao" 
            placeholder="Descreva a clínica detalhadamente" 
            rows={4}
            value={formData.descricao}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="atendimentoDomicilio" 
              checked={formData.atendimentoDomicilio}
              onCheckedChange={handleHomeServiceChange}
            />
            <Label htmlFor="atendimentoDomicilio">Atendimento a domicílio?</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="estacionamento" 
              checked={formData.estacionamento}
              onCheckedChange={handleParkingChange}
            />
            <Label htmlFor="estacionamento">Possui estacionamento?</Label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="horarioAtendimento">Horários de Funcionamento</Label>
          <Input 
            id="horarioAtendimento" 
            placeholder="Ex: Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h" 
            value={formData.horarioAtendimento}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="especialidades">Especialidades (separadas por vírgula)</Label>
          <Input 
            id="especialidades" 
            placeholder="Ex: Dermatologia, Cardiologia, Ortopedia" 
            value={formData.especialidades}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="servicos">Serviços Oferecidos (separados por vírgula)</Label>
          <Input 
            id="servicos" 
            placeholder="Ex: Consultas, Cirurgias, Exames de Imagem" 
            value={formData.servicos}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="imagens">Imagens</Label>
          <Input 
            id="imagens" 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="contatos">Telefone</Label>
          <Input 
            id="contatos" 
            placeholder="(XX) XXXXX-XXXX" 
            value={formData.contatos}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
          <Input 
            id="whatsapp" 
            placeholder="(XX) XXXXX-XXXX" 
            value={formData.whatsapp}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="exemplo@clinica.com.br" 
            value={formData.email}
            onChange={handleInputChange}
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
          <Label htmlFor="endereco">Endereço Completo</Label>
          <Input 
            id="endereco" 
            placeholder="Rua, número, complemento, bairro" 
            value={formData.endereco}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="localizacao">Cidade e Estado</Label>
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
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      localizacao: "Localização atual (use um serviço de geocodificação em produção)" 
                    }));
                  });
                }
              }}
            >
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
          {isSubmitting ? "Publicando..." : "Cadastrar Clínica/Serviço Veterinário"}
        </Button>
      </form>
    </div>
  );
};

export default EmpresaClinicForm;
