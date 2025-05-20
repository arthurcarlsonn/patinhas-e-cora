
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

const petSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  type: z.string().min(1, { message: 'Selecione um tipo' }),
  breed: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  temperament: z.string().optional(),
  status: z.string().min(1, { message: 'Selecione um status' }),
  description: z.string().optional(),
  contact_whatsapp: z.string().optional(),
  location: z.string().min(3, { message: 'Informe a localização' }),
  main_image_url: z.string().optional(),
  is_neutered: z.boolean().optional(),
  is_vaccinated: z.boolean().optional(),
  accepts_children: z.boolean().optional(),
  accepts_other_animals: z.boolean().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

const PetEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      type: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      color: '',
      temperament: '',
      status: '',
      description: '',
      contact_whatsapp: '',
      location: '',
      main_image_url: '',
      is_neutered: false,
      is_vaccinated: false,
      accepts_children: false,
      accepts_other_animals: false,
    },
  });

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching pet:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar as informações do pet',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        if (data) {
          console.log('Pet data loaded:', data);
          
          // Check if the current user is the owner of the pet
          if (user?.id !== data.user_id) {
            toast({
              title: 'Acesso negado',
              description: 'Você não tem permissão para editar este pet',
              variant: 'destructive',
            });
            navigate('/dashboard');
            return;
          }
          
          // Set form values from data
          form.reset({
            name: data.name || '',
            type: data.type || '',
            breed: data.breed || '',
            age: data.age || '',
            gender: data.gender || '',
            size: data.size || '',
            color: data.color || '',
            temperament: data.temperament || '',
            status: data.status || '',
            description: data.description || '',
            contact_whatsapp: data.contact_whatsapp || '',
            location: data.location || '',
            main_image_url: data.main_image_url || '',
            is_neutered: data.is_neutered || false,
            is_vaccinated: data.is_vaccinated || false,
            accepts_children: data.accepts_children || false,
            accepts_other_animals: data.accepts_other_animals || false,
          });
        } else {
          toast({
            title: 'Pet não encontrado',
            description: 'O pet que você está tentando editar não existe',
            variant: 'destructive',
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar os dados do pet',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id, navigate, toast, form, user]);

  const onSubmit = async (values: PetFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!id || !user) {
        throw new Error('ID do pet ou usuário não encontrado');
      }

      const { error } = await supabase
        .from('pets')
        .update({
          name: values.name,
          type: values.type,
          breed: values.breed,
          age: values.age,
          gender: values.gender,
          size: values.size,
          color: values.color,
          temperament: values.temperament,
          status: values.status,
          description: values.description,
          contact_whatsapp: values.contact_whatsapp,
          location: values.location,
          main_image_url: values.main_image_url,
          is_neutered: values.is_neutered,
          is_vaccinated: values.is_vaccinated,
          accepts_children: values.accepts_children,
          accepts_other_animals: values.accepts_other_animals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Pet atualizado',
        description: 'O pet foi atualizado com sucesso',
      });
      
      navigate(`/pet/${id}`);
    } catch (error: any) {
      console.error('Error updating pet:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o pet',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pet-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados do pet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-pet-purple mb-6">Editar Pet</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pet*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Rex" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Animal*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cachorro">Cachorro</SelectItem>
                            <SelectItem value="Gato">Gato</SelectItem>
                            <SelectItem value="Ave">Ave</SelectItem>
                            <SelectItem value="Roedor">Roedor</SelectItem>
                            <SelectItem value="Réptil">Réptil</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raça</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Labrador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 2 anos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Macho">Macho</SelectItem>
                            <SelectItem value="Fêmea">Fêmea</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porte</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o porte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pequeno">Pequeno</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Grande">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Caramelo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="perdido">Perdido</SelectItem>
                            <SelectItem value="encontrado">Encontrado</SelectItem>
                            <SelectItem value="adocao">Para Adoção</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: São Paulo, SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact_whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp para contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: (11) 98765-4321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="main_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="URL da imagem" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cole o link da imagem principal do pet
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o pet, personalidade, história, etc." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="temperament"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Dócil, brincalhão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Características Adicionais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="is_neutered"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Castrado</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="is_vaccinated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Vacinas em dia</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accepts_children"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Aceita crianças</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accepts_other_animals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Aceita outros animais</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 justify-end">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(`/pet/${id}`)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-pet-purple hover:bg-purple-700"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PetEdit;
