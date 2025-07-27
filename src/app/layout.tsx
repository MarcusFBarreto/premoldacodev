import type {Metadata} from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Lajes premoldadas em Maracanaú e Fortaleza | Premoldaço',
  description: 'Fábrica de lajes premoldadas em Maracanaú. Atendemos toda Fortaleza e região com blocos de EPS e cerâmicos, ferragens e tudo para lajes. Qualidade e entrega rápida. Peça seu orçamento!',
  keywords: ['lajes premoldadas', 'tijolos cerâmicos', 'EPS', 'construção civil', 'Premoldaço', 'Maracanaú', 'Fortaleza'],
  authors: [{ name: 'Premoldaço' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0D2LXG4PQE"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0D2LXG4PQE');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
