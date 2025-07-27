import Link from "next/link";
import { Building2, Facebook, Instagram, Twitter, ToyBrick } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <ToyBrick className="h-7 w-7" />
              <span className="font-headline">Premoldaço</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Soluções inovadoras em concreto pré-moldado para a sua construção.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Produtos</Link></li>
              <li><Link href="/projects" className="text-muted-foreground hover:text-primary">Projetos</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/recommendations" className="text-muted-foreground hover:text-primary">Calculadora I.A.</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>(85) 99294-7431</li>
              <li>contato@premoldaco.com.br</li>
              <li>R. Luís Gonzaga dos Santos, 300 - Maracanaú, CE</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/premoldaco_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              <Link href="https://www.facebook.com/premoldacomaracanau/?locale=pt_BR" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Premoldaço. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
