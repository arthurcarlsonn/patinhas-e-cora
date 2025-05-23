import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, User, Building, Heart } from 'lucide-react';

const Entrar = () => {
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para cadastro
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userType, setUserType] = useState('personal'); // 'personal', 'company', 'ngo'

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      if (user.user_metadata.type === 'ngo') {
        navigate('/ong/dashboard');
      } else if (user.user_metadata.type === 'company') {
        navigate('/empresa/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    if (!acceptTerms) {
      alert("Você precisa aceitar os termos de uso para se cadastrar.");
      return;
    }
    
    await signUp(
      registerEmail,
      registerPassword,
      userType as 'personal' | 'company' | 'ngo',
      { name }
    );
  };
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 bg-pet-softGray">
        <div className="container px-4 max-w-md">
          <Card className="shadow-lg border-none">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="pb-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login" className="data-[state=active]:bg-pet-purple data-[state=active]:text-white">
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-pet-purple data-[state=active]:text-white">
                    <User className="mr-2 h-4 w-4" /> Cadastrar
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Senha</Label>
                        <Link to="/esqueci-senha" className="text-xs text-pet-purple hover:underline">
                          Esqueceu?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pet-purple hover:bg-pet-lightPurple"
                      disabled={loading}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Seu nome" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">E-mail</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de cadastro</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          type="button"
                          variant={userType === 'personal' ? 'default' : 'outline'}
                          className={userType === 'personal' ? "bg-pet-purple hover:bg-pet-lightPurple" : ""}
                          onClick={() => setUserType('personal')}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Pessoal
                        </Button>
                        <Button 
                          type="button"
                          variant={userType === 'company' ? 'default' : 'outline'}
                          className={userType === 'company' ? "bg-pet-purple hover:bg-pet-lightPurple" : ""}
                          onClick={() => setUserType('company')}
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Empresa
                        </Button>
                        <Button 
                          type="button"
                          variant={userType === 'ngo' ? 'default' : 'outline'}
                          className={userType === 'ngo' ? "bg-pet-purple hover:bg-pet-lightPurple" : ""}
                          onClick={() => setUserType('ngo')}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          ONG/Voluntário
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        Aceito os <Link to="/termos" className="text-pet-purple hover:underline">termos de uso</Link> e <Link to="/privacidade" className="text-pet-purple hover:underline">política de privacidade</Link>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pet-purple hover:bg-pet-lightPurple"
                      disabled={loading}
                    >
                      {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="relative w-full my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">ou continue com</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleGoogleSignIn}
                  type="button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Conectando...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Entrar com Google
                    </>
                  )}
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Entrar;
