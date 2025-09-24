
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Aviso Importante</CardTitle>
          <CardDescription>
            O aplicativo foi movido para um novo endereço.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <div className="space-y-2">
            <p className="font-semibold">Novo link do app:</p>
            <p>
              <Link
                href="http://pastel-facil.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold text-accent hover:underline"
              >
                pastel-facil.vercel.app
              </Link>
            </p>
          </div>

          <p>
            Atualizado com as configurações pedidas: leitor de código de barras
            e interação com vários aparelhos (PC e celular).
          </p>

          <p className="font-bold text-primary">
            O aplicativo esta pronto com todas as atualizações pedidas. ja esta 100% utilizavel. so adicioar os produdos e vender.
          </p>
          
          <p className="font-semibold">Para entrar, a senha é: <span className="font-bold text-accent">0201</span></p>

          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <p>
              Rafael, se possível me manda uma mensagem no Instagram:
            </p>
            <p>
              <Link
                href="https://www.instagram.com/irineu.marcos/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                https://www.instagram.com/irineu.marcos/
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
