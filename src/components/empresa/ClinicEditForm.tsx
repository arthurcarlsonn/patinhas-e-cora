import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Loader2, MapPin, Phone, Mail, Globe, Whatsapp } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { Separator } from '@/components/ui/separator';

interface Clinic {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  main_image_url: string;
  phone: string;
  email: string;
  website: string;
  whatsapp: string;
  specialties: string[];
  has_parking: boolean;
  has_home_service: boolean;
  company_id: string;
  social_media: Record<string, string>;
  created_at: string;
  updated_at: string;
}

const ClinicEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<File[] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    whatsapp: '',
    specialties: '',
    has_parking: false,
    has_home_service: false,
    social_media: {
      facebook: '',
      instagram: ''
    }
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(
    clinic?.main_image_url
  );

  useEffect(() => {
    if (!user || !id) {
      navigate('/entrar');
      return;
    }

    const fetchClinicData = async () => {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const socialMediaData = handleSocialMediaInput(data.social_media);

          setClinic(data);
          setFormData({
            name: data.name,
            description: data.description,
            address: data.address,
            location: data.location,
            phone: data.phone,
            email: data.email,
            website: data.website,
            whatsapp: data.whatsapp,
            specialties: data.specialties ? data.specialties.join(', ') : '',
            has_parking: data.has_parking,
            has_home_service: data.has_home_service,
            social_media: socialMediaData
          });
          setCurrentImageUrl(data.main_image_url);
        }
      } catch (error) {
        console.error('Erro ao buscar clínica:', error);
        toast.error('Não foi possível carregar os dados da clínica');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, [id, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !clinic) {
      toast.error("Você não tem permissão para editar esta clínica");
      return;
    }

    setSaving(true);

    try {
      // Upload da imagem
      let imageUrl = currentImageUrl;
      if (image && image.length > 0) {
        // Implementar a lógica de upload da imagem aqui
        // imageUrl = await uploadImage(image[0]);
        toast.error("Implementar a lógica de upload da imagem aqui");
        return;
      }

      // Atualizar clínica no banco de dados
      const { error } = await supabase
        .from('clinics')
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          whatsapp: formData.whatsapp,
          specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
          has_parking: formData.has_parking,
          has_home_service: formData.has_home_service,
          main_image_url: imageUrl,
          social_media: formData.social_media
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Clínica atualizada com sucesso!");
      navigate('/empresa/dashboard');

    } catch (error: any) {
      console.error('Erro ao atualizar clínica:', error);
      toast.error(error.message || "Não foi possível atualizar a clínica. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSocialMediaInput = (socialMediaData: any): Record<string, string> => {
    if (typeof socialMediaData === 'string') {
      try {
        return JSON.parse(socialMediaData);
      } catch {
        return {};
      }
    }
    
    if (socialMediaData && typeof socialMediaData === 'object') {
      const result: Record<string, string> = {};
      Object.entries(socialMediaData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          result[key] = value;
        }
      });
      return result;
    }
    
    return {};
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pet-purple" />
        </div>
      </Card>
    );
  }

  if (!clinic) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Clínica não encontrada</h2>
            <p className="text-gray-600 mb-6">
              A clínica que você está tentando editar não existe ou foi removida.
            </p>
            <Button
              onClick={() => navigate('/empresa/dashboard')}
              className="bg-pet-purple hover:bg-pet-lightPurple"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6 text-pet-darkPurple">Editar Clínica</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da clínica</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite o nome da clínica"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva os serviços e diferenciais da clínica"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Rua, número, bairro"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="location"
                className="pl-8"
                placeholder="Cidade/Estado"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  className="pl-8"
                  placeholder="(XX) XXXX-XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="relative">
                <Whatsapp className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="whatsapp"
                  className="pl-8"
                  placeholder="(XX) X XXXX-XXXX"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                className="pl-8"
                placeholder="contato@clinicapet.com.br"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="website"
                type="url"
                className="pl-8"
                placeholder="www.clinicapet.com.br"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialties">Especialidades</Label>
            <Textarea
              id="specialties"
              rows={3}
              value={formData.specialties}
              onChange={handleInputChange}
              placeholder="Separe as especialidades por vírgula"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has_parking"
                checked={formData.has_parking}
                onCheckedChange={(checked) => handleSwitchChange("has_parking", checked)}
              />
              <Label htmlFor="has_parking" className="cursor-pointer">Possui estacionamento</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="has_home_service"
                checked={formData.has_home_service}
                onCheckedChange={(checked) => handleSwitchChange("has_home_service", checked)}
              />
              <Label htmlFor="has_home_service" className="cursor-pointer">Atendimento a domicílio</Label>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label>Redes Sociais</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="Link do Facebook"
                  value={formData.social_media.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="Link do Instagram"
                  value={formData.social_media.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label htmlFor="image">Imagem da Clínica</Label>
            <MediaUpload
              id="clinic-image"
              label="Selecione uma imagem para a clínica"
              accept="image/*"
              multiple={false}
              onChange={setImage}
              value={image}
              existingUrls={currentImageUrl ? [currentImageUrl] : []}
              required={false}
            />
          </div>

          <Button
            type="submit"
            className="bg-pet-purple hover:bg-pet-lightPurple"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClinicEditForm;
