export interface Gene {
  abbreviation: string;
  chromosome: string;
  name: string;
  gene: string;
  start: number;
  end: number;
  dir: number;
  type: string;
  insideOf_genes_upstream_1k_plus: G4[];
  insideOf_gene_plus: G4[];
  partOverlapWith_gene_plus_upstreamEnd: G4[];
  partOverlapWith_gene_plus_downstreamEnd: G4[];
  insideOf_genes_upstream_2k_plus: G4[];
  insideOf_genes_upstream_3k_plus: G4[];
  insideOf_genes_upstream_4k_plus: G4[];
  insideOf_genes_upstream_5k_plus: G4[];
  insideOf_genes_downstream_1k_plus: G4[];
  insideOf_genes_downstream_2k_plus: G4[];
  insideOf_genes_downstream_3k_plus: G4[];
  insideOf_genes_downstream_4k_plus: G4[];
  insideOf_genes_downstream_5k_plus: G4[];
  insideOf_gene_minus: G4[];
  partOverlapWith_gene_minus_upstreamEnd: G4[];
  partOverlapWith_gene_minus_downstreamEnd: G4[];
  insideOf_genes_upstream_1k_minus: G4[];
  insideOf_genes_upstream_2k_minus: G4[];
  insideOf_genes_upstream_3k_minus: G4[];
  insideOf_genes_upstream_4k_minus: G4[];
  insideOf_genes_upstream_5k_minus: G4[];
  insideOf_genes_downstream_1k_minus: G4[];
  insideOf_genes_downstream_2k_minus: G4[];
  insideOf_genes_downstream_3k_minus: G4[];
  insideOf_genes_downstream_4k_minus: G4[];
  insideOf_genes_downstream_5k_minus: G4[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 添加字符串索引签名
}

export interface GeneLocation {
  start: number;
  end: number;
}

interface G4 {
  T1: number;
  T2: number;
  T3: number;
  T4: number;
  TS: number;
  GS: number;
  SEQ: string;
}
