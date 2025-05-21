import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaUpload from '@/components/MediaUpload';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  main_image_url?: string;
}

const EmpresaProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product>({
    title: '',
    description: '',
    price: 0,
    location: '',
    category: '',
    main_image_url: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [company, setCompany] = useState<{ id: string; company_name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/entrar');
      return;
    }

    const fetchCompanyAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, company_name')
          .eq('user_id', user.id)
          .single();

        if (companyError) {
          throw companyError;
        }

        if (companyData) {
          setCompany(companyData);

          // Fetch products for the company
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('company_id', companyData.id);

          if (productsError) {
            throw productsError;
          }

          if (productsData) {
            setProducts(productsData);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyAndProducts();
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company) {
      toast({
        title: "Erro",
        description: "Você precisa cadastrar sua empresa primeiro.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Upload image if it exists
      let imageUrl = product.main_image_url;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `products/${company.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('pet-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      // Create product in database
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            ...product,
            company_id: company.id,
            main_image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      setProducts([...products, productData]);

      // Reset form
      setProduct({
        title: '',
        description: '',
        price: 0,
        location: '',
        category: '',
        main_image_url: ''
      });
      setImage(null);

      toast({
        title: "Produto cadastrado",
        description: "O produto foi cadastrado com sucesso."
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro ao cadastrar produto",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cadastrar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                type="text"
                id="title"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Preço</Label>
              <Input
                type="number"
                id="price"
                value={product.price.toString()}
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                type="text"
                id="location"
                value={product.location}
                onChange={(e) => setProduct({ ...product, location: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                onValueChange={(value) => setProduct({ ...product, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                  <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                  <SelectItem value="Higiene e Beleza">Higiene e Beleza</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Imagem Principal</Label>
              <MediaUpload
                id="image"
                label="Selecione uma imagem"
                accept="image/*"
                multiple={false}
                onChange={(files) => {
                  if (files && files.length > 0) {
                    setImage(files[0]);
                  } else {
                    setImage(null);
                  }
                }}
              />
            </div>
            <Button disabled={isSaving} className="w-full bg-pet-purple hover:bg-pet-lightPurple">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Cadastrar Produto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Produtos Cadastrados</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p>Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                id={product.id}
                title={product.title}
                image={product.main_image_url || '/placeholder.svg'}
                price={product.price}
                companyName={company?.company_name || 'Empresa'}
                location={product.location}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpresaProductForm;
