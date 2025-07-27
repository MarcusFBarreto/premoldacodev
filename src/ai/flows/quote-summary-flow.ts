'use server';
/**
 * @fileOverview Flow para gerar um resumo comercial de uma solicitação de orçamento.
 *
 * - generateQuoteSummary - Gera um resumo em texto a partir dos dados do formulário.
 * - QuoteSummaryInput - O tipo de entrada para a função.
 * - QuoteSummaryOutput - O tipo de saída para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculateQuoteMaterials, Comodo } from '@/services/quote-calculator';

const ComodoSchema = z.object({
  largura: z.number().describe('A largura do cômodo em metros.'),
  comprimento: z.number().describe('O comprimento do cômodo em metros.'),
  tipoBloco: z
    .string()
    .describe('O tipo de bloco ou enchimento (ex: "Tijolo Cerâmico" ou "Isopor (EPS)").'),
});

const QuoteSummaryInputSchema = z.object({
  nomeObra: z.string().describe('O nome que o cliente deu para a obra.'),
  comodos: z
    .array(ComodoSchema)
    .describe('A lista de cômodos com suas respectivas medidas e tipo de bloco.'),
  solicitarVisita: z
    .boolean()
    .describe('Indica se o cliente solicitou uma visita técnica para medição.'),
  observacoes: z
    .string()
    .optional()
    .describe('Qualquer observação ou comentário adicional fornecido pelo cliente.'),
});

export type QuoteSummaryInput = z.infer<typeof QuoteSummaryInputSchema>;

const QuoteSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('O resumo comercial gerado, pronto para ser enviado internamente.'),
});

export type QuoteSummaryOutput = z.infer<typeof QuoteSummaryOutputSchema>;

const getMaterialCalculation = ai.defineTool(
  {
    name: 'getMaterialCalculation',
    description: 'Calcula a quantidade de materiais necessários (lajotas, vigotas) e a área total com base na lista de cômodos. Deve ser sempre chamado para obter os quantitativos.',
    inputSchema: z.object({ comodos: z.array(ComodoSchema) }),
    outputSchema: z.object({
        totalArea: z.number(),
        totalLajotas: z.number(),
        totalVigotas: z.number(),
    })
  },
  async (input) => calculateQuoteMaterials(input.comodos as Comodo[])
);


const prompt = ai.definePrompt({
  name: 'quoteSummaryPrompt',
  tools: [getMaterialCalculation],
  input: {schema: QuoteSummaryInputSchema},
  output: {schema: QuoteSummaryOutputSchema},
  prompt: `Você é um assistente comercial da Premoldaço. Sua tarefa é criar um resumo claro e profissional de uma nova solicitação de orçamento recebida pelo site.

Use a ferramenta 'getMaterialCalculation' para calcular a área total e a quantidade de materiais necessários.

O resumo deve ser fácil de ler para a equipe de vendas. Use um tom amigável e informativo.

Dados recebidos:
- Nome da Obra: {{{nomeObra}}}
- Deseja visita técnica: {{#if solicitarVisita}}Sim{{else}}Não{{/if}}
{{#if observacoes}}- Observações do Cliente: {{{observacoes}}}{{/if}}

Detalhes dos Cômodos:
{{#each comodos}}
- Cômodo {{@index_1}}: Largura de {{{largura}}}m, Comprimento de {{{comprimento}}}m, Bloco de {{{tipoBloco}}}.
{{/each}}

Com base nos dados e nos resultados da ferramenta, gere o campo "summary" com o texto do resumo. O resumo deve consolidar as informações de forma coesa, incluindo os totais calculados e os alertas sobre os vãos. Se o cliente solicitar uma visita, destaque isso. Se houver observações, inclua-as de forma proeminente.
  `,
});

const quoteSummaryFlow = ai.defineFlow(
  {
    name: 'quoteSummaryFlow',
    inputSchema: QuoteSummaryInputSchema,
    outputSchema: QuoteSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateQuoteSummary(
  input: QuoteSummaryInput
): Promise<QuoteSummaryOutput> {
  return await quoteSummaryFlow(input);
}
