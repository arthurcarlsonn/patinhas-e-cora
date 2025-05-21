
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OngImageUpload from './OngImageUpload';

interface OrganizationData {
  id: string;
  name: string;
  type: string;
  action_area: string;
  whatsapp: string;
  email: string;
  website?: string;
  location: string;
  description: string;
  main_image_url?: string;
  social_media?: any;
}

const OngProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    if (!user) return;

    const fetchOngData = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar dados da ONG:', error);
          return;
        }

        if (data) {
          setOrganization(data);
          
          // Processar redes sociais se existirem
          if (data.social_media && typeof data.social_media === 'object') {
            const social = data.social_media as Record<string, string>;
            setSocialMedia({
              instagram: social.instagram || '',
              facebook: social.facebook || ''
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados da ONG:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOngData();
  }, [user]);

  const handleSave = async () => {
    if (!user || !organization) return;

    setSaving(true);
    try {
      // Atualizar dados da organização incluindo redes sociais
      const { error } = await supabase
        .from('organizations')
        .update({
          ...organization,
          social_media: socialMedia
        })
        .eq('id', organization.id);

      if (error) throw error;

      toast.success("Suas informações foram salvas com sucesso");
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(error.message || "Ocorreu um erro ao salvar os dados");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdated = () => {
    // Refresh organization data after image update
    if (user) {
      supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setOrganization(prev => prev ? { ...prev, main_image_url: data.main_image_url } : data);
          }
        });
    }
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

  if (!organization) {
    return (
      <Card className="p-6">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Perfil de ONG não encontrado</h2>
            <p className="text-gray-600 mb-6">
              Você precisa cadastrar sua ONG ou entidade voluntária primeiro.
            </p>
            <Button
              onClick={() => window.location.href = '#cadastro'}
              className="bg-pet-purple hover:bg-pet-lightPurple"
            >
              Cadastrar minha ONG
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <OngImageUpload 
        organizationId={organization.id}
        currentImage={organization.main_image_url}
        onImageUpdated={handleImageUpdated}
      />

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-pet-darkPurple">Informações da ONG</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da ONG/Iniciativa</Label>
              <Input
                id="name"
                value={organization.name}
                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Categoria</Label>
                <Select
                  value={organization.type}
                  onValueChange={(value) => setOrganization({ ...organization, type: value })}
                >
                  <SelectTrigger id="type">
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
                <Label htmlFor="action_area">Área de Atuação</Label>
                <Select
                  value={organization.action_area}
                  onValueChange={(value) => setOrganization({ ...organization, action_area: value })}
                >
                  <SelectTrigger id="action_area">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={organization.whatsapp}
                  onChange={(e) => setOrganization({ ...organization, whatsapp: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={organization.email}
                  onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Site (opcional)</Label>
                <Input
                  id="website"
                  value={organization.website || ''}
                  onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={organization.location}
                  onChange={(e) => setOrganization({ ...organization, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram (opcional)</Label>
                <Input
                  id="instagram"
                  placeholder="@seuinstagram"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="facebook">Facebook (opcional)</Label>
                <Input
                  id="facebook"
                  placeholder="/seufacebook"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={5}
                value={organization.description}
                onChange={(e) => setOrganization({ ...organization, description: e.target.value })}
              />
            </div>

            <Button
              onClick={handleSave}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OngProfile;
