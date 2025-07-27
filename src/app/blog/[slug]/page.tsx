import { articles } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticleDetailsPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                 <Link href="/blog" className="text-sm text-primary hover:underline mb-4 inline-block">
                    &larr; Voltar para todos os artigos
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary leading-tight">{article.title}</h1>
                <div className="mt-4 flex justify-center items-center gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div className="relative h-96 md:h-[500px] w-full rounded-lg shadow-lg overflow-hidden mb-12">
                <Image 
                    src={article.image} 
                    alt={article.title} 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint={article.dataAiHint}
                />
            </div>
            
            <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            <Separator className="my-12" />

            <div className="text-center">
                <p className="text-muted-foreground">Gostou deste artigo? Compartilhe com seus colegas!</p>
                {/* Poderiam ser adicionados botões de compartilhamento aqui */}
            </div>

        </article>
    </div>
  );
}
