"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { createLead } from "./actions"; // Importa a nova server action

const blocosDisponiveis = [
    { value: 'Tijolo Cerâmico H8', label: 'Tijolo Cerâmico H8 (8x20x30cm) - Comum', inStock: true },
    { value: 'Tijolo Cerâmico H12', label: 'Tijolo Cerâmico H12 (12x20x30cm) - Raro', inStock: true },
    { value: 'Isopor (EPS)', label: 'Isopor (EPS) - Consultar', inStock: true },
    { value: 'H733', label: 'Lajota Concreto H733 (100x33x7cm) - Em Estoque', inStock: true },
    { value: 'H833', label: 'Lajota Concreto H833 (100x33x8cm) - Em Estoque', inStock: true },
    { value: 'H1033', label: 'Lajota Concreto H1033 (100x33x10cm) - Encomenda', inStock: false },
    { value: 'H1233', label: 'Lajota Concreto H1233 (100x33x12cm) - Em Estoque', inStock: true },
    { value: 'H1633', label: 'Lajota Concreto H1633 (100x33x16cm) - Encomenda', inStock: false },
    { value: 'H2033', label: 'Lajota Concreto H2033 (100x33x20cm) - Encomenda', inStock: false },
    { value: 'H2533', label: 'Lajota Concreto H2533 (100x33x25cm) - Encomenda', inStock: false },
    { value: 'H740', label: 'Lajota Concreto H740 (100x40x7cm) - Em Estoque', inStock: true },
    { value: 'H840', label: 'Lajota Concreto H840 (100x40x8cm) - Em Estoque', inStock: true },
    { value: 'H1040', label: 'Lajota Concreto H1040 (100x40x10cm) - Encomenda', inStock: false },
    { value: 'H1240', label: 'Lajota Concreto H1240 (100x40x12cm) - Em Estoque', inStock: true },
    { value: 'H1640', label: 'Lajota Concreto H1640 (100x40x16cm) - Encomenda', inStock: false },
    { value: 'H2040', label: 'Lajota Concreto H2040 (100x40x20cm) - Encomenda', inStock: false },
    { value: 'H2540', label: 'Lajota Concreto H2540 (100x40x25cm) - Encomenda', inStock: false },
];

const comodoSchema = z.object({
  largura: z.coerce.number().min(0.1, "Largura é obrigatória."),
  comprimento: z.coerce.number().min(0.1, "Comprimento é obrigatório."),
  tipoBloco: z.string().min(1, "Selecione um tipo de bloco."),
});

const formSchema = z.object({
  nomeObra: z.string().min(3, "O nome da obra é obrigatório."),
  // Adicionar campos de contato do cliente
  clienteNome: z.string().min(2, "O nome do cliente é obrigatório."),
  clienteEmail: z.string().email("Por favor, insira um email válido."),
  clienteTelefone: z.string().min(10, "O telefone é obrigatório."),
  comodos: z.array(comodoSchema).min(1, "Adicione pelo menos um cômodo."),
  solicitarVisita: z.boolean().default(false),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecommendationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeObra: "",
      clienteNome: "",
      clienteEmail: "",
      clienteTelefone: "",
      comodos: [{ largura: 0, comprimento: 0, tipoBloco: "" }],
      solicitarVisita: false,
      observacoes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "comodos",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      // Chama a nova server action para criar o lead no Firestore
      await createLead(values);
      
      toast({
        title: "Solicitação Enviada!",
        description: "Recebemos seus dados. Em breve, nossa equipe entrará em contato com seu orçamento.",
      });
      form.reset();

    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Enviar",
        description: "Não foi possível enviar sua solicitação. Por favor, tente novamente mais tarde ou entre em contato por telefone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Projeto</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para que nossa equipe possa gerar seu orçamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nomeObra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Obra</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Casa da Praia, Galpão Logístico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="p-4 border-primary/20">
              <CardTitle className="text-lg mb-4">Seus Dados de Contato</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="clienteNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="clienteTelefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(85) 99999-8888" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="clienteEmail"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>


            <div>
              <h3 className="text-lg font-medium mb-4">Cômodos da Obra</h3>
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 relative bg-muted/50">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                       <FormField
                        control={form.control}
                        name={`comodos.${index}.largura`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Largura (m)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} placeholder="Ex: 4.5"/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`comodos.${index}.comprimento`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comprimento (Vão)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} placeholder="Ex: 5.2"/>
                            </FormControl>
                             <p className="text-xs text-muted-foreground pt-1">Esta é a direção das vigotas.</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`comodos.${index}.tipoBloco`}
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Bloco/Enchimento</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o modelo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {blocosDisponiveis.map(bloco => (
                                    <SelectItem key={bloco.value} value={bloco.value}>
                                        {bloco.label}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-3 -right-3 h-7 w-7"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
               <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ largura: 0, comprimento: 0, tipoBloco: "" })}
               >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Cômodo
              </Button>
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tem algum detalhe importante sobre a obra? Ex: Urgência na entrega, acesso difícil, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="solicitarVisita"
                render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                    <FormLabel>
                        Desejo solicitar uma visita para medição na obra
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                        Nossa equipe técnica irá até o local para garantir a precisão do seu projeto.
                    </p>
                    </div>
                </FormItem>
                )}
            />

            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
