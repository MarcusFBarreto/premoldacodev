import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/products" className="text-sm text-primary hover:underline">
          &larr; Voltar para todos os produtos
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative h-96 w-full rounded-lg shadow-lg overflow-hidden mb-4">
            <Image 
              src={product.image} 
              alt={product.name} 
              layout="fill" 
              objectFit="cover"
              data-ai-hint={product.dataAiHint}
            />
          </div>
          <Badge>{product.category}</Badge>
        </div>
        <div>
          <h1 className="text-4xl font-bold font-headline mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{product.description}</p>
          <Button asChild size="lg">
            <Link href="/contact">Solicitar Orçamento</Link>
          </Button>
        </div>
      </div>
      
      <Separator className="my-12" />

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Especificações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between border-b pb-2 text-sm">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Principais Aplicações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.applications.map((app) => (
                <li key={app} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
