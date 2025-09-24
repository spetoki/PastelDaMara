
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function RafaelPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mural do Rafael
            </CardTitle>
            <CardDescription>Uma mensagem para você.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg min-h-[60px] space-y-4 text-sm text-foreground">
              <p>
                Rafael, estou sem whats, me chama no instagram:{' '}
                <Link
                  href="https://www.instagram.com/irineu.marcos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://www.instagram.com/irineu.marcos/
                </Link>
              </p>
              <p>
                Estou editando o app de acordo com o combinado, já criei o
                sistema de ler código de barras, agora estou criando banco de
                dados para que o app interaja com vários celulares.
              </p>
              <p>
                Vou criar um sistema de login por senha. A senha inicial para
                entrar no app será 1234.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
