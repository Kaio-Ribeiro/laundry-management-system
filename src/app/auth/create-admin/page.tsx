'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Droplets } from 'lucide-react';

export default function CreateAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuário admin criado com sucesso!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao criar usuário');
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500 rounded-full">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Criar Admin
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Página temporária para criar usuário administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 placeholder:text-gray-400"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="bg-green-50 border-green-200 text-green-700">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11 font-medium" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Usuário Admin
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a 
              href="/auth/login" 
              className="text-sm text-gray-500 hover:text-blue-500 underline"
            >
              Voltar para login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}