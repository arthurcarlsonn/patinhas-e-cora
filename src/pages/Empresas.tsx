
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
import { LogIn, Building, ShieldCheck } from 'lucide-react';

const Empresas = () => {
  const { signIn, signUp, user, userType, loading } = useAuth();
  const navigate = useNavigate();
  
  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para cadastro
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirecionar se já estiver logado como empresa
  useEffect(() => {
    if (user && userType === 'company') {
      navigate('/empresa/dashboard');
    }
  }, [user, userType, navigate]);

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
      'company',
      { company_name: companyName, cnpj }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 bg-pet-softGray">
        <div className="container px-4 max-w-md">
          <Card className="shadow-lg border-none">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="pb-2">
                <h2 className="text-2xl font-bold text-center mb-4 text-pet-purple">Área de Empresas</h2>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login" className="data-[state=active]:bg-pet-purple data-[state=active]:text-white">
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-pet-purple data-[state=active]:text-white">
                    <Building className="mr-2 h-4 w-4" /> Cadastrar
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">E-mail corporativo</Label>
                      <Input 
                        id="business-email" 
                        type="email" 
                        placeholder="empresa@exemplo.com" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="business-password">Senha</Label>
                        <Link to="/esqueci-senha" className="text-xs text-pet-purple hover:underline">
                          Esqueceu?
                        </Link>
                      </div>
                      <Input 
                        id="business-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember-business" />
                      <Label htmlFor="remember-business" className="text-sm">Lembrar de mim</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pet-purple hover:bg-pet-lightPurple"
                      disabled={loading}
                    >
                      {loading ? 'Entrando...' : 'Entrar como Empresa'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input 
                        id="company-name" 
                        type="text" 
                        placeholder="Sua empresa" 
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input 
                        id="cnpj" 
                        type="text" 
                        placeholder="00.000.000/0001-00" 
                        required
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-business-email">E-mail corporativo</Label>
                      <Input 
                        id="register-business-email" 
                        type="email" 
                        placeholder="empresa@exemplo.com" 
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-business-password">Senha</Label>
                      <Input 
                        id="register-business-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-business-password">Confirmar senha</Label>
                      <Input 
                        id="confirm-business-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms-business" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                        required
                      />
                      <Label htmlFor="terms-business" className="text-sm">
                        Aceito os <Link to="/termos" className="text-pet-purple hover:underline">termos de uso</Link> e <Link to="/privacidade" className="text-pet-purple hover:underline">política de privacidade</Link>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pet-purple hover:bg-pet-lightPurple"
                      disabled={loading}
                    >
                      {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-center mt-4 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 mr-1 text-pet-purple" />
                  <span className="text-sm">
                    Área exclusiva para empresas e profissionais do setor pet
                  </span>
                </div>
                <div className="text-center">
                  <Link to="/entrar" className="text-sm text-pet-purple hover:underline">
                    Voltar para login pessoal
                  </Link>
                </div>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Empresas;
