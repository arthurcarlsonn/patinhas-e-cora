
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('pet-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Erro ao processar upload de imagem:', error);
    return null;
  }
};

export const uploadMultipleImages = async (files: FileList): Promise<string[]> => {
  const uploadPromises = Array.from(files).map(file => uploadImage(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};
