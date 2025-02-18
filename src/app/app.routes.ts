import { Routes } from '@angular/router';
import { TaxonomyComponent } from './pages/taxonomy/taxonomy.component';

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
    title: 'Genome Search-G4Vista',
  },
  {
    path: 'taxonomy',
    component: TaxonomyComponent,
  },
  {
    path: 'genome/:abbreviation',
    loadComponent: () =>
      import('./pages/genome/genome-page/genome-page.component').then(
        m => m.GenomePageComponent
      ),
  },
  {
    path: 'gene',
    loadComponent: () =>
      import('./pages/gene/gene.component').then(m => m.GeneComponent),
    title: 'Gene Search-G4Vista',
  },
  {
    path: 'genome/:abbreviation/:chromosome$',
    loadComponent: () =>
      import('./pages/genome/genome-page/genome-page.component').then(
        m => m.GenomePageComponent
      ),
  },
  {
    path: 'genome/:abbreviation/:chromosome$/:gene$',
    loadComponent: () =>
      import('./pages/genome/genome-page/genome-page.component').then(
        m => m.GenomePageComponent
      ),
  },

  {
    path: 'environment',
    loadComponent: () =>
      import('./pages/environment/environment.component').then(
        m => m.EnvironmentComponent
      ),
    title: 'Environment Search-G4Vista',
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
