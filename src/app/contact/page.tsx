"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  subject: z.string().min(5, { message: "O assunto deve ter pelo menos 5 caracteres." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Retornaremos em breve.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Fale Conosco</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Tem alguma dúvida ou quer solicitar um orçamento? Preencha o formulário abaixo ou utilize um de nossos canais de atendimento.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
            <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>Nossa equipe está pronta para te atender.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="seu.email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assunto</FormLabel>
                            <FormControl>
                            <Input placeholder="Sobre o que você quer falar?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Digite sua mensagem aqui..." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Enviar Mensagem</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nossas Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <MapPin className="h-6 w-6 text-primary" />
                        <span>R. Luís Gonzaga dos Santos, 300 - Jardim Paraiso, Maracanaú - CE, 61932-600</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 text-primary" />
                        <span>(85) 99294-7431</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-primary" />
                        <span>contato@premoldaco.com.br</span>
                    </div>
                </CardContent>
            </Card>
            <div className="w-full h-64 rounded-lg overflow-hidden">
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.528357754942!2d-38.601784988824!3d-3.905625096181781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0a52013a50431%3A0x63346513a073f1a2!2sPremolda%C3%A7o%20Pr%C3%A9-moldados!5e0!3m2!1spt-BR!2sbr!4v1716307849356!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Premoldaço"
                ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
}
