
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { uploadImage } from '@/utils/uploadUtils';

interface OngImageUploadProps {
  organizationId: string;
  currentImage?: string;
  onImageUpdated?: () => void;
}

const OngImageUpload = ({ organizationId, currentImage, onImageUpdated }: OngImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');

  useEffect(() => {
    if (currentImage) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);

  const handleUpload = async () => {
    if (!image || !user || !organizationId) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(image);
      
      if (!imageUrl) {
        throw new Error("Falha no upload da imagem");
      }

      // Update organization with new image URL
      const { error } = await supabase
        .from('organizations')
        .update({ main_image_url: imageUrl })
        .eq('id', organizationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreviewUrl(imageUrl);
      
      toast({
        title: "Imagem atualizada",
        description: "A imagem da ONG foi atualizada com sucesso.",
      });

      // Call callback if provided
      if (onImageUpdated) {
        onImageUpdated();
      }
      
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setImage(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Imagem da ONG</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewUrl && (
          <div className="mb-4 overflow-hidden rounded-lg border">
            <img 
              src={previewUrl} 
              alt="Imagem da ONG" 
              className="w-full aspect-video object-cover" 
            />
          </div>
        )}

        <div>
          <Label htmlFor="ong-image">Selecione uma nova imagem</Label>
          <MediaUpload
            id="ong-image"
            label=""
            accept="image/*"
            multiple={false}
            onChange={(files) => files && files.length > 0 ? setImage(files[0]) : setImage(null)}
            value={image ? [image] : null}
            required={false}
          />
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!image || isUploading}
          className="w-full bg-pet-purple hover:bg-pet-lightPurple"
        >
          {isUploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> Atualizar imagem</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OngImageUpload;
