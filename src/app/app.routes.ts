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
    path: 'ncbi',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/ncbi/ncbi.component').then(m => m.NcbiComponent),
    title: 'G4Vista',
  },
  {
    path: 'mbgd',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/mbgd/mbgd.component').then(m => m.MbgdComponent),
    title: 'G4Vista',
  },
  {
    path: 'taxonomy',
    loadComponent: () =>
      import('./pages/taxonomy/taxonomy.component').then(
        m => m.TaxonomyComponent
      ),
    title: 'Taxonomy Search',
  },
  {
    path: 'gene',
    loadComponent: () =>
      import('./pages/gene/gene.component').then(m => m.GeneComponent),
    title: 'Gene Search',
  },
  {
    path: 'environment',
    loadComponent: () =>
      import('./pages/environment/environment.component').then(
        m => m.EnvironmentComponent
      ),
    title: 'Env Search',
  },
  {
    path: 'genome/:abbreviation',
    loadComponent: () =>
      import('./pages/genome/genome-page/genome-page.component').then(
        m => m.GenomePageComponent
      ),
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
    path: 'taxonomy/:name',
    loadComponent: () =>
      import('./pages/taxonomy/taxonomy-page/taxonomy-page.component').then(
        m => m.TaxonomyPageComponent
      ),
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
