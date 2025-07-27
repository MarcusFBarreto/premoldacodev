// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, User, LogOut, Loader2, KeyRound, Globe, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, User as FirebaseUser } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


// Tipos de Status e Orçamento
type Status =
  | 'Novo'
  | 'Em Análise'
  | 'Aprovado'
  | 'Aguardando Produção'
  | 'Em Produção'
  | 'Pronto p/ Entrega'
  | 'Aguardando Carga'
  | 'Carregando'
  | 'Em Rota'
  | 'Entregue'
  | 'Finalizado'
  | 'Cancelado';

interface Quote {
  id: string;
  nomeObra: string;
  status: Status;
  data: string;
  cliente: string;
  telefone: string;
  email: string;
  vendedor?: string;
  placaVeiculo?: string;
  tipoLaje?: string;
  totalArea?: number;
  origem?: 'web' | 'app'; // Campo para diferenciar a origem
  // Adicionar todos os outros campos que podem vir do firestore
  [key: string]: any;
}


// Mapeamento de status para cores do Tailwind/ShadCN
const statusColors: Record<Status, string> = {
  'Novo': 'bg-blue-500 hover:bg-blue-600',
  'Em Análise': 'bg-yellow-500 hover:bg-yellow-600 text-black',
  'Aprovado': 'bg-green-600 hover:bg-green-700',
  'Aguardando Produção': 'bg-gray-500 hover:bg-gray-600',
  'Em Produção': 'bg-purple-600 hover:bg-purple-700',
  'Pronto p/ Entrega': 'bg-orange-500 hover:bg-orange-600',
  'Aguardando Carga': 'bg-cyan-500 hover:bg-cyan-600 text-black',
  'Carregando': 'bg-blue-700 hover:bg-blue-800', // Azul mais escuro pra diferenciar
  'Em Rota': 'bg-teal-500 hover:bg-teal-600',
  'Entregue': 'bg-green-700 hover:bg-green-800',
  'Finalizado': 'bg-gray-700 hover:bg-gray-800',
  'Cancelado': 'bg-red-600 hover:bg-red-700',
};


function QuoteCard({ quote, user, collectionName }: { quote: Quote, user: FirebaseUser, collectionName: string }) {
  
  const handleStatusChange = async (newStatus: Status) => {
    const quoteRef = doc(db, collectionName, quote.id);
    let dataToUpdate: { [key: string]: any } = { status: newStatus };

    if (newStatus === 'Carregando') {
      const placa = prompt("Por favor, digite a placa do veículo de entrega:");
      if (placa && placa.trim() !== '') {
        dataToUpdate.placaVeiculo = placa.trim().toUpperCase();
      } else {
        alert("A mudança de status foi cancelada pois a placa não foi informada.");
        return; 
      }
    }
    
    try {
      await updateDoc(quoteRef, dataToUpdate);
      console.log(`Status do orçamento ${quote.id} atualizado para ${newStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Não foi possível atualizar o status.");
    }
  };

  const handleClaim = async () => {
    if (!user?.displayName) {
        alert("Nome do vendedor não encontrado. Não é possível resgatar.");
        return;
    }

    const batch = writeBatch(db);
    
    // Referência ao documento original em 'webleads'
    const oldDocRef = doc(db, "webleads", quote.id);
    
    // Referência ao novo documento em 'orcamentos'
    const newDocRef = doc(db, "orcamentos", quote.id);

    // Prepara os dados para o novo documento, lendo os dados atuais do lead
    const leadSnapshot = await getDoc(oldDocRef);
    if (!leadSnapshot.exists()) {
        alert("Este lead não existe mais.");
        return;
    }
    
    const leadData = leadSnapshot.data();
    
    const newQuoteData = {
        ...leadData,
        vendedor: user.displayName, // Adiciona o vendedor
        status: 'Em Análise' as Status, // Muda o status inicial
        origem: 'app' as const, // Marca como se fosse do app agora
    };

    batch.set(newDocRef, newQuoteData); // Cria o novo documento em 'orcamentos'
    batch.delete(oldDocRef); // Deleta o documento antigo de 'webleads'

    try {
        await batch.commit();
        console.log(`Orçamento ${quote.id} resgatado por ${user.displayName} e movido para 'orcamentos'.`);
    } catch (error) {
        console.error("Erro ao resgatar orçamento:", error);
        alert("Falha ao resgatar o orçamento.");
    }
  };

  const handleCancel = async () => {
    if(confirm(`Tem certeza que deseja CANCELAR o orçamento para a obra "${quote.nomeObra}"?`)){
       try {
         await updateDoc(doc(db, collectionName, quote.id), { status: 'Cancelado' });
         console.log(`Orçamento ${quote.id} cancelado.`);
       } catch(error){
         console.error("Erro ao cancelar orçamento:", error);
         alert("Falha ao cancelar o orçamento.");
       }
    }
  }
  
  const availableStatuses = Object.keys(statusColors) as Status[];

  return (
    <Card className="flex flex-col border-2 border-transparent hover:border-primary transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <div className="flex items-center gap-2 mb-1">
                    {quote.origem === 'web' ? <Globe className="h-4 w-4 text-muted-foreground" title="Origem: Web"/> : <Star className="h-4 w-4 text-muted-foreground" title="Origem: App/Interno" />}
                    <CardTitle>{quote.nomeObra}</CardTitle>
                 </div>
                 <CardDescription>Recebido em: {quote.data}</CardDescription>
                 <p className="text-xs text-muted-foreground pt-1">ID: {quote.id}</p>
            </div>
            <Badge className={cn("text-white shadow-md", statusColors[quote.status])}>
                {quote.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <h4 className="font-semibold text-sm mb-1">Cliente</h4>
            <p className="text-muted-foreground">{quote.clienteNome || quote.cliente}</p>
            <p className="text-muted-foreground text-sm">{quote.clienteEmail || quote.email}</p>
            <p className="text-muted-foreground text-sm">{quote.clienteTelefone || quote.telefone}</p>
        </div>

        {quote.vendedor ? (
             <div>
                <h4 className="font-semibold text-sm">Vendedor Responsável</h4>
                <p className="text-muted-foreground">{quote.vendedor}</p>
            </div>
        ) : (
             <Button onClick={handleClaim} className="w-full bg-green-600 hover:bg-green-700">
                Resgatar Orçamento
            </Button>
        )}

        {quote.placaVeiculo && (
            <div className="bg-muted p-3 rounded-md border-l-4 border-primary">
                <h4 className="font-semibold text-sm">Veículo de Entrega</h4>
                <p className="text-muted-foreground font-mono">{quote.placaVeiculo}</p>
            </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-between items-center gap-4 bg-muted/50 p-4 rounded-b-lg">
        <Select defaultValue={quote.status} onValueChange={(value: Status) => handleStatusChange(value)}>
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder="Mudar status..." />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user.role === 'superadmin' && (
            <Button variant="destructive" size="sm" onClick={handleCancel}>Cancelar</Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AdminDashboard({ user, logout }: { user: FirebaseUser, logout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [webLeads, setWebLeads] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState("app");

  useEffect(() => {
    if (!user.role || !user.displayName) return;

    let quotesQuery;
    if (user.role === 'vendas') {
        // Vendedor só vê seus próprios orçamentos
        quotesQuery = query(
            collection(db, 'orcamentos'), 
            where("vendedor", "==", user.displayName), 
            orderBy("dataCriacao", "desc")
        );
    } else {
        // Outras roles (admin, gerencia) veem todos
        quotesQuery = query(collection(db, 'orcamentos'), orderBy("dataCriacao", "desc"));
    }

    const unsubQuotes = onSnapshot(quotesQuery, (querySnapshot) => {
        const dataList = querySnapshot.docs.map(doc => {
             const data = doc.data();
             const dataCriacao = data.dataCriacao?.toDate ? data.dataCriacao.toDate().toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
             return { id: doc.id, ...data, data: dataCriacao } as Quote;
        });
        setQuotes(dataList);
        setLoading(false);
    }, (error) => {
        console.error(`Erro ao ouvir a coleção orcamentos:`, error);
        alert("Erro ao carregar orçamentos. Verifique o console para um link de criação de índice no Firestore.");
        setLoading(false);
    });

    const webLeadsQuery = query(collection(db, 'webleads'), orderBy("dataCriacao", "desc"));
    const unsubWebLeads = onSnapshot(webLeadsQuery, (querySnapshot) => {
        const dataList = querySnapshot.docs.map(doc => {
             const data = doc.data();
             const dataCriacao = data.dataCriacao?.toDate ? data.dataCriacao.toDate().toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');
             return { id: doc.id, ...data, data: dataCriacao } as Quote;
        });
        setWebLeads(dataList);
    }, (error) => {
        console.error(`Erro ao ouvir a coleção webleads:`, error);
    });

    return () => {
        unsubQuotes();
        unsubWebLeads();
    };
  }, [user.role, user.displayName]);

  const filteredQuotes = () => {
    if (activeTab === 'web') {
        // Vendedores veem todos os webleads não resgatados
        return webLeads;
    }
    if (activeTab === 'app') {
        // A própria query já filtra para o vendedor, aqui apenas retornamos a lista.
        return quotes;
    }
    // Aba 'todos' para gerencia/superadmin
    return [...webLeads, ...quotes].sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  const getCollectionNameForQuote = (quote: Quote) => {
      // Se a cotação não tem vendedor e a origem é web, ainda é um 'weblead'.
      return quote.origem === 'web' ? 'webleads' : 'orcamentos';
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Building2 className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold text-primary font-headline">Painel Premoldaço</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right text-sm hidden sm:block">
                    <p className="font-semibold">{user.displayName || user.email}</p>
                    <p className="text-muted-foreground capitalize">{user.role}</p>
                </div>
                <User className="h-6 w-6 sm:hidden"/>
                <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5 text-red-500"/>
                </Button>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Orçamentos Recebidos</h2>
            <p className="text-muted-foreground">Acompanhe e gerencie as solicitações da sua equipe.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
             {(user.role === 'superadmin' || user.role === 'gerencia') && <TabsTrigger value="todos">Todos</TabsTrigger> }
            <TabsTrigger value="web">
              <Globe className="mr-2 h-4 w-4"/> Web Leads ({webLeads.length})
            </TabsTrigger>
            <TabsTrigger value="app">
              <Star className="mr-2 h-4 w-4"/> {user.role === 'vendas' ? 'Meus Orçamentos' : 'App / Internos'} ({quotes.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <p className="text-muted-foreground">Carregando orçamentos...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQuotes().map(quote => (
                    <QuoteCard key={quote.id} quote={quote} user={user} collectionName={getCollectionNameForQuote(quote)} />
                ))}
            </div>
        )}
      </main>
    </div>
  );
}

function LoginPage({ login, error, loading }: { login: (email: string, pass: string) => void, error: string | null, loading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">Acesso ao Painel</CardTitle>
          <CardDescription>Use suas credenciais para entrar no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@premoldaco.com.br"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  const { user, loading, error, login, logout } = useAuth();

   if (loading && !user) { // Mostra o loader principal apenas na checagem inicial
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <AdminDashboard user={user} logout={logout} />;
  }

  return <LoginPage login={login} error={error} loading={loading} />;
}

    