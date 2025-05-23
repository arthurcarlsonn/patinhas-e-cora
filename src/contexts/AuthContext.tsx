
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userType: 'personal' | 'company' | 'ngo' | null;
  signUp: (email: string, password: string, type: 'personal' | 'company' | 'ngo', metadata: object) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'personal' | 'company' | 'ngo' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Configure o listener de autorização
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userType = session.user.user_metadata.type as 'personal' | 'company' | 'ngo' | null;
          setUserType(userType);
          
          // Redireciona com base no tipo de usuário
          if (userType === 'personal' && window.location.pathname === '/entrar') {
            navigate('/dashboard');
          } else if (userType === 'company' && window.location.pathname === '/empresas') {
            navigate('/empresa/dashboard');
          } else if (userType === 'ngo' && window.location.pathname === '/entrar') {
            navigate('/ong/dashboard');
          }
        } else {
          setUserType(null);
        }
      }
    );

    // Verifique se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userType = session.user.user_metadata.type as 'personal' | 'company' | 'ngo' | null;
        setUserType(userType);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (
    email: string,
    password: string,
    type: 'personal' | 'company' | 'ngo',
    metadata: object
  ) => {
    setLoading(true);
    
    try {
      // Adiciona o tipo de usuário aos metadados
      const fullMetadata = { ...metadata, type };
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullMetadata
        }
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu e-mail para confirmar o cadastro",
      });
      
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao tentar se cadastrar",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Definir tipo de usuário no localStorage para acesso fácil em outros componentes
      if (data.user) {
        const userType = data.user.user_metadata.type as 'personal' | 'company' | 'ngo';
        
        if (userType === 'personal') {
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.removeItem('businessUserLoggedIn');
          localStorage.removeItem('ngoUserLoggedIn');
        } else if (userType === 'company') {
          localStorage.setItem('businessUserLoggedIn', 'true');
          localStorage.removeItem('userLoggedIn');
          localStorage.removeItem('ngoUserLoggedIn');
        } else if (userType === 'ngo') {
          localStorage.setItem('ngoUserLoggedIn', 'true');
          localStorage.removeItem('userLoggedIn');
          localStorage.removeItem('businessUserLoggedIn');
        }
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Você está conectado!",
      });
      
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais incorretas ou usuário não existe",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Erro ao entrar com Google",
        description: error.message || "Ocorreu um erro ao tentar entrar com Google",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpa os dados do localStorage
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('businessUserLoggedIn');
      localStorage.removeItem('ngoUserLoggedIn');
      
      // Redireciona para a página inicial
      navigate('/');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userType,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
