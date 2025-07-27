import { projects, Project } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image 
          src={project.image} 
          alt={project.name} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint={project.dataAiHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm flex-grow">{project.description}</p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/projects/${project.slug}`}>
            Ver Projeto
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Portfólio de Projetos</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Veja nossos produtos em ação em projetos de sucesso que demonstram a qualidade e versatilidade das nossas soluções.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
