import { Chromosome } from './Chromosome';
import { G4Statistics } from './G4Statistics';

export interface GenomeInfo {
  genome: string;
  chromosome_list: Chromosome[];
  description: string;
  g4_statistics: G4Statistics;
}
