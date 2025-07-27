import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gauge, Warehouse, Ruler, ArrowRight, User, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { articles, Article } from '@/lib/data';

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={article.image}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={article.dataAiHint}
          />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription className="pt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm flex-grow">{article.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/blog/${article.slug}`}>
            Ler Artigo Completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const latestArticles = articles.slice(0, 2);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="bg-card py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                Premoldaço: Lajes pré-moldadas em Maracanaú
              </h1>
              <p className="text-lg text-muted-foreground">
                Distribuímos para Fortaleza, metropolitanas e interior. Quem é exigente compra com a gente! Agilidade e qualidade para sua obra.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/products">Nossos Produtos</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Fale Conosco</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96 rounded-xl shadow-2xl overflow-hidden">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="Estoque de pré-moldados"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="warehouse concrete"
                />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Por que escolher a Premoldaço?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Nossa expertise garante a excelência em cada etapa do seu projeto.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Warehouse className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="pt-4">Agilidade e Grande Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Receba seus materiais no prazo para manter sua obra no cronograma.</p>
                </CardContent>
            </Card>
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Ruler className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="pt-4">Comodidade com Medição na Obra</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Nossa equipe especializada realiza medições precisas no local da sua obra.</p>
                </CardContent>
            </Card>
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Gauge className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="pt-4">Qualidade Superior e Confiança</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Utilizamos materiais de ponta e processos rigorosos para garantir a máxima qualidade e durabilidade.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      <section className="bg-accent text-accent-foreground py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Não sabe qual produto escolher?</h2>
            <p className="mt-4 max-w-2xl mx-auto">
                Utilize nossa ferramenta de recomendação com Inteligência Artificial para encontrar a solução perfeita para as suas necessidades.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/recommendations">
                    Premoldaço I.A.
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Fique por Dentro: Nosso Blog</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Acompanhe nossas dicas, notícias e insights sobre o mundo da construção.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/blog">
                    Ver Todos os Artigos
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline mb-4">Sua Fábrica de Pré-Moldados em Maracanaú</h2>
            <p className="text-muted-foreground mb-6">
              Há mais de 10 anos no mercado, a Premoldaço é referência em lajes pré-moldadas, tijolos cerâmicos e blocos de EPS em Fortaleza e região. Nosso compromisso é entregar qualidade, agilidade e confiança para sua obra.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Missão, Visão e Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Missão</h3>
                  <p className="text-muted-foreground">Fornecer materiais de construção de alta qualidade, com entrega rápida e atendimento personalizado.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Visão</h3>
                  <p className="text-muted-foreground">Ser a principal escolha em soluções para construção civil no Nordeste.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Valores</h3>
                  <p className="text-muted-foreground">Qualidade, confiança, inovação e compromisso com o cliente.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="relative h-80 rounded-xl shadow-lg overflow-hidden">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Equipe da Premoldaço"
              layout="fill"
              objectFit="cover"
              data-ai-hint="team construction"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
