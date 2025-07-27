import { articles, Article } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User, Calendar } from 'lucide-react';

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

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Nosso Blog</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Dicas, notícias e insights do mundo da construção civil. Fique por dentro das últimas tendências e melhores práticas com a equipe Premoldaço.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
