export interface Chromosome {
  name: string;
  length: number;
  start?: number;
  end?: number;
  g4_count?: number;
  gene_count?: number;
  g4_tetreds: string[];
}
