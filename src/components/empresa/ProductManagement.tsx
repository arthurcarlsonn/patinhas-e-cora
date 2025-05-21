import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard, { ProductCardProps } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Import ProductEditForm component, but this component doesn't seem to be provided yet
import ProductEditForm from './ProductEditForm';

interface ProductManagementProps {
  companyId: string;
}

const ProductManagement = ({ companyId }: ProductManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [companyId]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedProducts: ProductCardProps[] = data.map(product => ({
          id: product.id,
          title: product.title,
          image: product.main_image_url || '/placeholder.svg',
          price: product.price,
          location: product.location,
          category: product.category,
          views: product.views || 0
        }));
        
        setProducts(formattedProducts);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    try {
      // Delete product images first
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', selectedProduct.id);

      if (imagesError) throw imagesError;

      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);

      if (error) throw error;

      // Update local state
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso."
      });
      
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleProductUpdate = (updatedProduct: ProductCardProps) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleSubmitSuccess = () => {
    fetchProducts();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seus Produtos</h2>
        {/* ProductForm component is not provided yet */}
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground mb-6">Adicione seu primeiro produto para começar a vender.</p>
            <Button 
              variant="default" 
              className="bg-pet-purple hover:bg-pet-lightPurple"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard {...product} />
              <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-white hover:bg-gray-100 h-8 w-8"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-white hover:bg-red-100 text-red-500 hover:text-red-600 h-8 w-8"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductEditForm
              product={selectedProduct}
              onCancel={() => setIsEditing(false)}
              onUpdate={handleProductUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
