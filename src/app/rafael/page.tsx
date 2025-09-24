
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { getRafaelMessage, saveRafaelMessage } from '@/lib/data';

export default function RafaelPage() {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load the message from Firestore on component mount
    const fetchMessage = async () => {
      const savedMessage = await getRafaelMessage();
      setMessage(savedMessage);
      setNewMessage(savedMessage);
    };
    fetchMessage();
  }, []);

  const handleSaveMessage = async () => {
    await saveRafaelMessage(newMessage);
    setMessage(newMessage);
    toast({
      title: 'Mensagem salva!',
      description: 'Sua nova mensagem foi guardada.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mural do Rafael
              </CardTitle>
               <CardDescription>Deixe uma mensagem para você mesmo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 mb-4 bg-muted/50 rounded-lg min-h-[60px]">
                    <p className="text-sm text-foreground">{message || 'Nenhuma mensagem no momento.'}</p>
                </div>
               <Textarea
                placeholder="Escreva sua nova mensagem aqui..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-4"
                />
            </CardContent>
             <CardFooter>
                <Button onClick={handleSaveMessage}>Salvar Mensagem</Button>
            </CardFooter>
          </Card>
        </div>
    </div>
  );
}
