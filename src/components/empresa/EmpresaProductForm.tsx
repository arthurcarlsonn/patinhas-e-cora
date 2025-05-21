
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, MapPin, DollarSign } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import ProductCard, { ProductCardProps } from '@/components/ProductCard';
import { uploadMultipleImages } from '@/utils/uploadUtils';

type Company = {
  id: string;
  name: string;
}

interface EmpresaProductFormProps {
  onSuccess?: () => void;
  onSubmitComplete?: () => void;
}

const EmpresaProductForm = ({ onSuccess, onSubmitComplete }: EmpresaProductFormProps) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [image, setImage] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<ProductCardProps | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    category: '',
    home_delivery: false
  });

  useEffect(() => {
    if (!user) return;

    const fetchUserCompanies = async () => {
      try {
        // Fetch companies where the user is the owner
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name')
          .eq('id', user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedCompanies: Company[] = data.map(company => ({
            id: company.id,
            name: company.company_name
          }));
          setCompanies(formattedCompanies);
          setSelectedCompanyId(formattedCompanies[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Não foi possível carregar suas empresas');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompanies();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Update preview
    updatePreview({ [id]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, home_delivery: checked }));
  };
  
  const updatePreview = (newData: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...newData };
    
    setPreview({
      id: 'preview',
      title: updatedData.title || 'Título do Produto',
      price: parseFloat(updatedData.price) || 0,
      image: image && image.length > 0 
        ? URL.createObjectURL(image[0]) 
        : 'https://via.placeholder.com/300x200?text=Imagem+do+Produto',
      category: updatedData.category || 'Categoria',
      location: updatedData.location || 'Localização',
      views: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedCompanyId) {
      toast.error("Você precisa selecionar uma empresa para adicionar um produto");
      return;
    }

    setSaving(true);
    
    try {
      // Upload da imagem
      let imageUrl = null;
      if (image && image.length > 0) {
        const urls = await uploadMultipleImages(image);
        if (urls.length > 0) {
          imageUrl = urls[0];
        }
      }

      // Inserir produto no banco de dados
      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          category: formData.category,
          home_delivery: formData.home_delivery,
          company_id: selectedCompanyId,
          main_image_url: imageUrl
        });

      if (error) throw error;

      toast.success("Seu produto foi adicionado com sucesso!");

      // Limpar formulário
      setFormData({
        title: '',
        price: '',
        description: '',
        location: '',
        category: '',
        home_delivery: false
      });
      setImage(null);
      setPreview(null);
      
      // Callback de sucesso
      if (onSuccess) onSuccess();
      if (onSubmitComplete) onSubmitComplete();
      
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      toast.error(error.message || "Não foi possível adicionar seu produto. Tente novamente.");
    } finally {
      setSaving(false);
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

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Nenhuma empresa cadastrada</h2>
            <p className="text-gray-600 mb-6">
              Você precisa cadastrar uma empresa antes de adicionar produtos.
            </p>
            <Button
              onClick={() => window.location.href = '/empresas'}
              className="bg-pet-purple hover:bg-pet-lightPurple"
            >
              Cadastrar minha empresa
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-pet-darkPurple">Adicionar Produto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {companies.length > 1 && (
              <div>
                <Label htmlFor="company_id">Empresa</Label>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger id="company_id">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="title">Nome do produto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Digite o nome do produto"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Preço</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-8"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }));
                  updatePreview({ category: value });
                }}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentos">Alimentos</SelectItem>
                  <SelectItem value="brinquedos">Brinquedos</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                  <SelectItem value="higiene">Higiene</SelectItem>
                  <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                  <SelectItem value="camas">Camas e Casinhas</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="home_delivery"
                checked={formData.home_delivery}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="home_delivery" className="cursor-pointer">Entrega a domicílio</Label>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição do produto</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva detalhes importantes sobre o produto"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="image">Imagem do Produto</Label>
              <MediaUpload 
                id="product-image"
                label="Selecione uma imagem para o produto"
                accept="image/*"
                multiple={false}
                onChange={setImage}
                value={image}
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
                'Adicionar Produto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Preview */}
      {preview && (
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Prévia do Produto</h2>
          <div className="max-w-sm mx-auto">
            <ProductCard
              id={preview.id}
              title={preview.title}
              image={preview.image}
              price={preview.price}
              location={preview.location}
              category={preview.category}
              views={0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaProductForm;
