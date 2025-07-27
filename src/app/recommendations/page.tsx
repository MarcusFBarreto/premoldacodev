import RecommendationForm from './recommendation-form';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Premoldaço I.A.</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Preencha os dados abaixo para obter um orçamento preciso para o seu projeto. Nossa inteligência artificial pode ajudar a otimizar sua obra. Adicione quantos cômodos forem necessários.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <RecommendationForm />
      </div>
    </div>
  );
}
