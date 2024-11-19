export interface GenomeInfo {
  genome: string;
  chromosomes: string[];
  description: string;
}

export interface G4_MBGD {
  name: string;
  seqname: string;
  T1: number;
  T2: number;
  T3: number;
  T4: number;
  TS: number;
  GS: number;
  SEQ: string;
  gene: string;
}
