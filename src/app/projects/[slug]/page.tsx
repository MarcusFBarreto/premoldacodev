import { projects, products as allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }
  
  const usedProducts = allProducts.filter(p => project.productsUsed.includes(p.name));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/projects" className="text-sm text-primary hover:underline">
          &larr; Voltar para todos os projetos
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{project.name}</h1>
      </div>

      <div className="relative h-96 md:h-[500px] w-full rounded-lg shadow-lg overflow-hidden mb-12">
        <Image 
            src={project.image} 
            alt={project.name} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={project.dataAiHint}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-4">Sobre o Projeto</h2>
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Produtos Utilizados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {usedProducts.map((product) => (
                  <li key={product.id}>
                    <Link href={`/products/${product.slug}`} className="flex items-center gap-3 text-sm group">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="group-hover:text-primary group-hover:underline">{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
