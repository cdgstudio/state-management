import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
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
        path: 'named-states',
        loadComponent: () => import('./demos/named-states'),
      },
      {
        path: 'single-state',
        loadComponent: () => import('./demos/single-state'),
      },
      {
        path: 'filterable-table',
        loadComponent: () => import('./demos/filterable-table'),
      },
      {
        path: 'ui-state',
        loadComponent: () => import('./demos/ui-state'),
      },
    ]),
  ],
};
