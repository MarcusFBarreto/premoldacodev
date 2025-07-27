"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, X, ToyBrick, Construction, Lightbulb, Mail, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/products", label: "Produtos", icon: ToyBrick },
  { href: "/projects", label: "Projetos", icon: Construction },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/recommendations", label: "Premoldaço I.A.", icon: Lightbulb },
  { href: "/contact", label: "Contato", icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );
  
  const MobileNavLink = ({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3 text-lg rounded-md transition-colors",
        pathname.startsWith(href) ? "bg-primary text-primary-foreground" : "hover:bg-accent"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
        <Icon className="h-6 w-6" />
        {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <ToyBrick className="h-8 w-8" />
          <span className="font-headline">Premoldaço</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs p-4 flex flex-col">
                <SheetHeader className="text-left mb-4">
                    <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <ToyBrick className="h-7 w-7" />
                        <span className="font-headline">Premoldaço</span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Navegação principal do site.
                    </SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                    <MobileNavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
                    ))}
                </nav>

                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
