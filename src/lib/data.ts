
export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specifications: { [key: string]: string };
  applications: string[];
  dataAiHint: string;
}

export interface Project {
  id: number;
  slug: string;
  name:string;
  image: string;
  description: string;
  productsUsed: string[];
  dataAiHint: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  author: string;
  date: string;
  content: string; // O conteúdo completo viria aqui, possivelmente em Markdown
  dataAiHint: string;
}


export const products: Product[] = [
  {
    id: 7,
    slug: 'trelica-para-laje',
    name: 'Treliça para Laje',
    category: 'Estruturas',
    image: 'https://placehold.co/600x400.png',
    description: 'Estrutura de aço em formato de treliça, essencial para a fabricação de vigotas treliçadas (trilhos) e para dar rigidez à laje. Garante a resistência e a segurança do sistema.',
    specifications: {
      'Material': 'Aço CA-60 Nervurado',
      'Alturas (H)': '8cm, 12cm, 16cm, 20cm, 25cm',
      'Comprimento': 'Barras de 12 metros',
      'Norma': 'ABNT NBR 14862',
    },
    applications: ['Fabricação de Vigotas Treliçadas', 'Estruturação de Lajes', 'Nervuras de Travamento', 'Espaçador para malhas'],
    dataAiHint: 'steel truss'
  },
  {
    id: 8,
    slug: 'vigota-trelicada-trilho',
    name: 'Vigota Treliçada (Trilho)',
    category: 'Estruturas',
    image: 'https://placehold.co/600x400.png',
    description: 'Componente fundamental da laje treliçada, composto por uma base de concreto e uma treliça de aço. Define a direção e o suporte principal da laje, sendo preenchido com lajotas ou EPS.',
    specifications: {
      'Treliça Utilizada': 'TG8, TG12, TG16 (conforme projeto)',
      'Base de Concreto': 'Aprox. 3cm x 12cm',
      'Comprimento': 'Sob medida (até 7 metros)',
      'Resistência': 'Concreto de alta resistência inicial',
    },
    applications: ['Lajes residenciais', 'Lajes comerciais', 'Vãos de até 12 metros (com escoramento adequado)'],
    dataAiHint: 'concrete joist'
  },
  {
    id: 9,
    slug: 'vergalhao-de-aco',
    name: 'Vergalhão de Aço',
    category: 'Aço para Construção',
    image: 'https://placehold.co/600x400.png',
    description: 'Barras de aço nervuradas (CA-50 e CA-60) para uso em estruturas de concreto armado. Essenciais para a montagem de vigas, pilares, e malhas de distribuição.',
    specifications: {
      'Tipo': 'CA-50 / CA-60',
      'Bitolas': '4.2mm, 5.0mm, 6.3mm (1/4"), 8.0mm (5/16"), 10.0mm (3/8")',
      'Comprimento': 'Barras de 12 metros (dobradas ou retas)',
      'Norma': 'ABNT NBR 7480',
    },
    applications: ['Armaduras de Concreto', 'Vigas', 'Pilares', 'Sapatas', 'Malhas de aço para lajes'],
    dataAiHint: 'steel rebar'
  },
  {
    id: 10,
    slug: 'bloco-ceramico-para-laje',
    name: 'Bloco Cerâmico para Laje',
    category: 'Enchimento para Lajes',
    image: 'https://placehold.co/600x400.png',
    description: 'Também conhecido como tijolo para laje ou tavela, é o elemento de enchimento mais tradicional e econômico para lajes treliçadas. Oferece bom conforto térmico e acústico. Os tamanhos mais comuns são H8 (8cm de altura) e H12 (12cm de altura).',
    specifications: {
      'Material': 'Argila cozida',
      'Modelo Comum': 'H8 (Altura 8cm x Largura 20cm x Comprimento 30cm)',
      'Modelo Raro': 'H12 (Altura 12cm x Largura 20cm x Comprimento 30cm)',
      'Rendimento': 'Aproximadamente 8,33 peças por m²',
    },
    applications: ['Lajes residenciais', 'Lajes comerciais de baixo tráfego', 'Soluções econômicas para vãos pequenos'],
    dataAiHint: 'ceramic block'
  },
  {
    id: 11,
    slug: 'bloco-de-eps-isopor-para-laje',
    name: 'Bloco de EPS (Isopor) para Laje',
    category: 'Enchimento para Lajes',
    image: 'https://placehold.co/600x400.png',
    description: 'O Poliestireno Expandido (EPS) é uma alternativa moderna e leve para o enchimento de lajes. Reduz significativamente o peso da estrutura, aliviando a carga nas vigas e fundações e melhorando o isolamento térmico.',
    specifications: {
      'Material': 'Poliestireno Expandido (Isopor)',
      'Densidade': 'Tipo 1F (adequado para lajes)',
      'Dimensões': 'Recortado conforme a necessidade do projeto',
      'Vantagens': 'Leveza, isolamento térmico superior, facilidade de manuseio',
    },
    applications: ['Lajes com grandes vãos', 'Obras que exigem redução de peso', 'Construções com foco em isolamento térmico'],
    dataAiHint: 'styrofoam block'
  },
  {
    id: 12,
    slug: 'produto-teste',
    name: 'Produto Teste',
    category: 'Testes',
    image: 'https://placehold.co/600x400.png',
    description: 'Este é um produto de teste para diversas finalidades de desenvolvimento e layout.',
    specifications: {
      'Tipo': 'Teste',
      'Validade': 'Indeterminada',
      'Finalidade': 'Verificação de componentes',
    },
    applications: ['Testes de layout', 'Testes de funcionalidade', 'Demonstrações'],
    dataAiHint: 'test product'
  }
];

export const projects: Project[] = [
  {
    id: 1,
    slug: 'centro-de-distribuicao-log-max',
    name: 'Centro de Distribuição Log-Max',
    image: 'https://placehold.co/600x400.png',
    description: 'Um moderno centro logístico de 50.000m² construído com agilidade e eficiência. A solução completa em pré-moldados permitiu a entrega em tempo recorde.',
    productsUsed: ['Vigota Treliçada (Trilho)', 'Treliça para Laje', 'Vergalhão de Aço'],
    dataAiHint: 'warehouse interior'
  },
  {
    id: 2,
    slug: 'edificio-comercial-prime-tower',
    name: 'Edifício Comercial Prime Tower',
    image: 'https://placehold.co/600x400.png',
    description: 'Edifício de escritórios com 15 pavimentos, onde a laje alveolar e os pilares pré-moldados garantiram andares com vãos livres e flexibilidade de layout.',
    productsUsed: ['Vigota Treliçada (Trilho)', 'Bloco de EPS (Isopor) para Laje'],
    dataAiHint: 'modern office'
  },
  {
    id: 3,
    slug: 'supermercado-compre-bem',
    name: 'Supermercado Compre Bem',
    image: 'https://placehold.co/600x400.png',
    description: 'Loja de varejo com amplo salão de vendas. As vigas de grande vão eliminaram a necessidade de pilares internos, otimizando a área de exposição de produtos.',
    productsUsed: ['Vigota Treliçada (Trilho)', 'Treliça para Laje', 'Bloco Cerâmico para Laje'],
    dataAiHint: 'supermarket aisle'
  },
];


export const articles: Article[] = [
  {
    id: 1,
    slug: 'vantagens-da-laje-trelicada-com-eps',
    title: 'As Vantagens Incomparáveis da Laje Treliçada com EPS (Isopor)',
    image: 'https://placehold.co/800x400.png',
    excerpt: 'Descubra por que a combinação de laje treliçada com blocos de EPS está revolucionando a construção civil, oferecendo leveza, isolamento e economia.',
    author: 'Equipe Premoldaço',
    date: '2024-05-20',
    content: `
<p>A construção civil está em constante evolução, buscando soluções que aliem eficiência, sustentabilidade e economia. Nesse cenário, a laje treliçada com preenchimento em Poliestireno Expandido (EPS), popularmente conhecido como isopor, destaca-se como uma das alternativas mais inteligentes do mercado.</p>
<h3 class="text-xl font-bold mt-6 mb-3">1. Leveza Estrutural</h3>
<p>A principal vantagem do EPS é sua incrível leveza. Em comparação com a tradicional lajota cerâmica, o EPS pode reduzir o peso próprio da laje em até 80%. Essa redução de carga alivia o peso sobre as vigas, pilares e fundações, o que pode gerar uma economia significativa no dimensionamento e no custo total da estrutura.</p>
<h3 class="text-xl font-bold mt-6 mb-3">2. Conforto Térmico e Acústico</h3>
<p>O EPS é um excelente isolante térmico. Ele dificulta a passagem de calor, tornando os ambientes internos mais frescos em climas quentes e mais aquecidos em climas frios. Isso se traduz em maior conforto para os ocupantes e economia de energia com ar-condicionado e aquecedores. Além disso, ele também contribui para um melhor isolamento acústico entre os pavimentos.</p>
<h3 class="text-xl font-bold mt-6 mb-3">3. Agilidade e Facilidade na Montagem</h3>
<p>Por ser leve, o manuseio e o transporte das placas de EPS na obra são muito mais simples e rápidos. A montagem da laje se torna mais ágil, reduzindo o tempo de mão de obra e o cronograma geral do projeto. Menos esforço físico para a equipe também significa um ambiente de trabalho mais seguro.</p>
    `,
    dataAiHint: 'construction eps'
  },
  {
    id: 2,
    slug: 'como-evitar-fissuras-em-lajes',
    title: 'Guia Prático: Como Evitar Fissuras em Lajes de Concreto',
    image: 'https://placehold.co/800x400.png',
    excerpt: 'Fissuras são um problema comum, mas evitável. Aprenda sobre as causas e as melhores práticas para garantir uma laje resistente e durável.',
    author: 'Eng. Fulano de Tal',
    date: '2024-05-15',
    content: `
<p>Fissuras em lajes de concreto são uma dor de cabeça para construtores e moradores. Embora nem toda fissura represente um risco estrutural, elas podem ser portas de entrada para infiltrações e outros problemas. A boa notícia é que a maioria pode ser evitada com boas práticas durante a execução.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Principais Causas de Fissuras</h3>
<ul>
  <li><strong>Retração do Concreto:</strong> A perda de água durante o processo de cura é a causa mais comum.</li>
  <li><strong>Cura Inadequada:</strong> Não manter o concreto úmido nos primeiros dias compromete sua resistência.</li>
  <li><strong>Sobrecarga:</strong> Cargas excessivas na laje antes ou depois da cura completa.</li>
  <li><strong>Vibração Excessiva:</strong> Adensamento inadequado do concreto.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Como Prevenir?</h3>
<p>A prevenção começa no planejamento. Utilize um concreto com fator água/cimento adequado e considere o uso de aditivos. Durante a concretagem, garanta o adensamento correto sem excessos. Mas o passo mais crucial é a <strong>cura do concreto</strong>. Mantenha a laje úmida por, no mínimo, 7 dias, utilizando mantas, irrigação ou agentes de cura química. Isso garantirá que o concreto atinja sua resistência máxima de forma gradual, minimizando a retração e o aparecimento de fissuras.</p>
    `,
    dataAiHint: 'concrete crack'
  }
];
