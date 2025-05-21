
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductCardProps } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmpresaProductForm from './EmpresaProductForm';
import ProductEditForm from './ProductEditForm';

interface ProductManagementProps {
  companyProducts: ProductCardProps[];
  setCompanyProducts: (products: ProductCardProps[]) => void;
}

const ProductManagement = ({ companyProducts, setCompanyProducts }: ProductManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    setIsLoading(true);
    try {
      // First delete related product images
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);
      
      if (imagesError) throw imagesError;
      
      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update state to remove the deleted product
      setCompanyProducts(companyProducts.filter(product => product.id !== productId));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product: ProductCardProps) => {
    setSelectedProduct(product);
    setActiveTab('edit');
  };

  const handleEditComplete = (updatedProduct: ProductCardProps) => {
    setCompanyProducts(
      companyProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setActiveTab('list');
    setSelectedProduct(null);
  };

  const handleCancelEdit = () => {
    setActiveTab('list');
    setSelectedProduct(null);
  };

  const refreshProducts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        // Convert database data to ProductCardProps format
        const formattedProducts: ProductCardProps[] = data.map(product => ({
          id: product.id,
          title: product.title,
          image: product.main_image_url || `https://via.placeholder.com/300x200?text=Produto`,
          price: Number(product.price),
          category: product.category,
          location: product.location,
          views: product.views || 0,
          business: {
            id: product.user_id,
            name: 'Empresa',
            verified: true
          },
          homeDelivery: product.home_delivery || false
        }));
        
        setCompanyProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'add' | 'edit')}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Eye size={16} />
            Listar Produtos
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar Produto
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meus Produtos</h2>
              <Button 
                variant="outline" 
                onClick={refreshProducts}
                disabled={isLoading}
              >
                Atualizar
              </Button>
            </div>
            
            {companyProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/300x200?text=Produto`;
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(product.price)}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.views}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isLoading}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Link to={`/produto/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">Nenhum produto encontrado.</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar seu primeiro produto
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <EmpresaProductForm 
            companyProducts={companyProducts}
            setCompanyProducts={setCompanyProducts}
            onSubmitSuccess={() => setActiveTab('list')}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          {selectedProduct && (
            <ProductEditForm 
              product={selectedProduct}
              onCancel={handleCancelEdit}
              onUpdate={handleEditComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManagement;
