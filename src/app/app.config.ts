import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./demos/main'),
  },
  {
    path: 'loading-state',
    loadComponent: () => import('./demos/loading-state'),
  },
  {
    path: 'more-states',
    loadComponent: () => import('./demos/more-states'),
  },
  {
    path: 'state-object',
    loadComponent: () => import('./demos/state-object'),
  },
  {
    path: 'named-states',
    loadComponent: () => import('./demos/named-states'),
  },

  {
    path: 'filterable-table',
    loadComponent: () => import('./demos/filterable-table'),
  },
  {
    path: 'ui-state',
    loadComponent: () => import('./demos/ui-state'),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes)],
};
