
export interface Comodo {
  largura: number;
  comprimento: number;
  tipoBloco: string;
}

export type CalculationInput = Comodo[];

export interface CalculationOutput {
  totalArea: number;
  totalLajotas: number;
  totalVigotas: number;
}

// Tabela de correspondência: vão (comprimento) -> vigotas por m²
const vigotasPorMetroTabela = new Map<number, number>([
  [2.0, 4.76],
  [2.1, 4.55],
  [2.2, 4.35],
  [2.3, 4.17],
  [2.4, 4.00],
  [2.5, 3.85],
  [2.6, 3.70],
  [2.7, 3.57],
  [2.8, 3.45],
  [2.9, 3.33],
  [3.0, 3.08],
  [3.1, 3.13],
  [3.2, 3.03],
  [3.3, 2.94],
  [3.4, 2.86],
  [3.5, 2.78],
  [3.6, 2.70],
  [3.7, 2.63],
  [3.8, 2.56],
  [3.9, 2.50],
  [4.0, 2.44],
  [4.1, 2.38],
  [4.2, 2.33],
  [4.3, 2.27],
  [4.4, 2.22],
  [4.5, 2.27],
  [4.6, 2.22],
  [4.7, 2.17],
  [4.8, 2.13],
  [4.9, 2.08],
  [5.0, 2.04],
]);

const LAJOTAS_POR_METRO_QUADRADO = 8.33;

function getVigotasPorMetro(comprimento: number): number {
    // Arredonda o comprimento para a casa decimal mais próxima (ex: 2.34 -> 2.3, 2.38 -> 2.4)
    const vao = parseFloat(comprimento.toFixed(1));

    // Se a medida exata existir na tabela, retorna
    if (vigotasPorMetroTabela.has(vao)) {
        return vigotasPorMetroTabela.get(vao)!;
    }

    // Caso contrário, encontra os valores mais próximos para interpolação
    const vaosConhecidos = Array.from(vigotasPorMetroTabela.keys()).sort((a, b) => a - b);
    
    // Se for menor que o mínimo, usa o valor do mínimo
    if (vao < vaosConhecidos[0]) {
        return vigotasPorMetroTabela.get(vaosConhecidos[0])!;
    }

    // Se for maior que o máximo, usa o valor do máximo
    if (vao > vaosConhecidos[vaosConhecidos.length - 1]) {
        return vigotasPorMetroTabela.get(vaosConhecidos[vaosConhecidos.length - 1])!;
    }
    
    // Interpolação linear para valores intermediários
    let vaoInferior = vaosConhecidos[0];
    let vaoSuperior = vaosConhecidos[vaosConhecidos.length - 1];

    for(let i = 0; i < vaosConhecidos.length; i++) {
        if(vaosConhecidos[i] <= vao) {
            vaoInferior = vaosConhecidos[i];
        }
        if(vaosConhecidos[i] >= vao && vaoSuperior > vaosConhecidos[i]) {
            vaoSuperior = vaosConhecidos[i];
        }
    }
    
    if (vaoInferior === vaoSuperior) {
        return vigotasPorMetroTabela.get(vaoInferior)!;
    }

    const valorInferior = vigotasPorMetroTabela.get(vaoInferior)!;
    const valorSuperior = vigotasPorMetroTabela.get(vaoSuperior)!;

    const proporcao = (vao - vaoInferior) / (vaoSuperior - vaoInferior);
    const valorInterpolado = valorInferior + proporcao * (valorSuperior - valorInferior);
    
    return valorInterpolado;
}


/**
 * Calcula os materiais necessários para uma lista de cômodos.
 * @param comodos A lista de cômodos com suas medidas.
 * @returns Um objeto com a área total, total de lajotas e total de vigotas.
 */
export function calculateQuoteMaterials(comodos: CalculationInput): CalculationOutput {
  let totalArea = 0;
  let totalLajotas = 0;
  let totalVigotas = 0;

  comodos.forEach(comodo => {
    const area = comodo.largura * comodo.comprimento;
    const vigotasPorMetro = getVigotasPorMetro(comodo.comprimento);

    totalArea += area;
    totalLajotas += area * LAJOTAS_POR_METRO_QUADRADO;
    totalVigotas += area * vigotasPorMetro;
  });

  return {
    totalArea: parseFloat(totalArea.toFixed(2)),
    totalLajotas: Math.ceil(totalLajotas),
    totalVigotas: Math.ceil(totalVigotas),
  };
}
