'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import { UtensilsCrossed, KeyRound, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function LoginPage() {
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key}),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Login bem-sucedido!',
          description: 'Você será redirecionado em breve.',
        });
        // router.push('/'); // This is removed.
        router.refresh(); // This will re-trigger the middleware and layout check.
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no Login',
          description: data.message || 'Chave de acesso incorreta.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Conexão',
        description: 'Não foi possível conectar ao servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
       <div className="absolute top-8 flex items-center gap-2 text-2xl font-semibold text-primary">
          <UtensilsCrossed className="h-8 w-8" />
          <span>PastelPro</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite sua chave de acesso para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-key">Chave de Acesso</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="access-key"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="********"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Lembrete</AlertTitle>
              <AlertDescription>
                Rafael, sua chave de acesso é 1234
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
