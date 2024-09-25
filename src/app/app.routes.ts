import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/homepage/homepage.component').then(
        m => m.HomepageComponent
      ),
    title: 'G4Vista',
  },
  {
    path: 'genome',
    loadComponent: () =>
      import('./pages/genome/genome.component').then(m => m.GenomeComponent),
    title: 'Genome - G4Vista',
  },
  {
    path: 'gene',
    loadComponent: () =>
      import('./pages/gene/gene.component').then(m => m.GeneComponent),
    title: 'Gene - G4Vista',
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: '404' },
];
