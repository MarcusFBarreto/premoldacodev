"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Schema para validação dos dados do formulário (deve ser o mesmo do cliente)
const comodoSchema = z.object({
  largura: z.number(),
  comprimento: z.number(),
  tipoBloco: z.string(),
});

const leadSchema = z.object({
  nomeObra: z.string(),
  clienteNome: z.string(),
  clienteEmail: z.string().email(),
  clienteTelefone: z.string(),
  comodos: z.array(comodoSchema),
  solicitarVisita: z.boolean(),
  observacoes: z.string().optional(),
});

type LeadData = z.infer<typeof leadSchema>;

/**
 * Cria um novo documento na coleção 'webleads' do Firestore.
 * Esta função é chamada pelo formulário de orçamento do site.
 * @param data Os dados do formulário validados.
 */
export async function createLead(data: LeadData) {
  // Valida os dados no servidor para garantir a integridade
  const validation = leadSchema.safeParse(data);

  if (!validation.success) {
    console.error("Erro de validação no servidor:", validation.error);
    throw new Error("Dados inválidos.");
  }

  try {
    const leadData = {
      ...validation.data,
      dataCriacao: serverTimestamp(), // Adiciona um timestamp do servidor
      status: "Novo", // Define o status inicial
      origem: "web", // Marca a origem do lead como 'web'
    };
    
    // A coleção agora é 'orcamentos' para unificar, mas a origem diferencia.
    // As regras do firestore precisam ser ajustadas para permitir isso.
    // Ou mantemos em webleads e o painel lê de duas coleções.
    // Por ora, vamos manter em webleads para respeitar as regras atuais.
    const docRef = await addDoc(collection(db, "webleads"), leadData);
    console.log("Lead criado com sucesso com o ID: ", docRef.id);
    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Erro ao escrever lead no Firestore: ", error);
    throw new Error("Falha ao salvar a solicitação no banco de dados.");
  }
}
