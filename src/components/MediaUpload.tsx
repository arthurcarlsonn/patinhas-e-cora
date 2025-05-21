
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, FileImage, FileVideo, Image, Video } from 'lucide-react';

interface MediaUploadProps {
  id: string;
  label: string;
  accept: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  value?: FileList | null;
  required?: boolean;
  existingUrls?: string[];
}

const MediaUpload = ({
  id,
  label,
  accept,
  multiple = false,
  onChange,
  value,
  required = false,
  existingUrls = [],
}: MediaUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set up previews from existing URLs
  React.useEffect(() => {
    if (existingUrls && existingUrls.length > 0) {
      setPreviews(existingUrls);
    }
  }, [existingUrls]);

  // Generate previews when files are selected
  React.useEffect(() => {
    if (!value) return;
    
    const newPreviews: string[] = [];
    
    Array.from(value).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === value.length) {
            setPreviews(newPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange(files);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        onChange(e.dataTransfer.files);
      } else {
        // If not multiple, just take the first file
        const singleFile = new DataTransfer();
        singleFile.items.add(e.dataTransfer.files[0]);
        onChange(singleFile.files);
      }
    }
  }, [multiple, onChange]);

  const clearFiles = () => {
    onChange(null);
    setPreviews([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isImage = accept.includes('image');
  const isVideo = accept.includes('video');

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-pet-purple bg-pet-softGray/50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input 
          id={id}
          ref={inputRef}
          type="file" 
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          required={required && previews.length === 0}
          className="hidden"
        />
        
        {previews.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden aspect-square shadow-sm border">
                  {isImage && preview.startsWith('data:image') && (
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isImage && !preview.startsWith('data:') && (
                    <img 
                      src={preview} 
                      alt={`Existing image ${index}`} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isVideo && preview.startsWith('data:video') && (
                    <video 
                      src={preview} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isVideo && !preview.startsWith('data:') && (
                    <video 
                      src={preview} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                {multiple ? 'Adicionar mais' : 'Alterar'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={clearFiles}
              >
                <X className="mr-2 h-4 w-4" />
                Limpar {multiple ? 'todos' : ''}
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center py-8 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <div className="bg-pet-lightPurple/20 rounded-full p-3 mb-4">
              {isImage ? (
                <FileImage className="h-8 w-8 text-pet-purple" />
              ) : isVideo ? (
                <FileVideo className="h-8 w-8 text-pet-purple" />
              ) : (
                <Upload className="h-8 w-8 text-pet-purple" />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Arraste e solte {isImage ? 'imagens' : isVideo ? 'vídeos' : 'arquivos'} aqui, ou
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Selecionar {isImage ? 'imagens' : isVideo ? 'vídeos' : 'arquivos'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
