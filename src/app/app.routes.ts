import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: 'signals',
    loadComponent: () => import('./features/signals/signals.component'),
    title: 'Signals · ng-playground',
  },
  {
    path: 'forms',
    loadComponent: () => import('./features/forms/forms.component'),
    title: 'Forms · ng-playground',
  },
  {
    path: 'crud',
    loadComponent: () => import('./features/crud/crud.component'),
    title: 'CRUD · ng-playground',
  },
  {
    path: 'ssr-defer',
    loadComponent: () => import('./features/ssr-defer/ssr-defer.component'),
    title: 'SSR @defer · ng-playground',
  },
  {
    path: 'rxjs',
    loadComponent: () => import('./features/rxjs/rxjs.component'),
    title: 'RxJS · ng-playground',
  },
  {
    path: 'di',
    loadComponent: () => import('./features/di/di.component'),
    title: 'DI · ng-playground',
  },
  {
    path: 'router',
    loadComponent: () => import('./features/router/router.component'),
    title: 'Router · ng-playground',
  },
  {
    path: 'animations',
    loadComponent: () => import('./features/animations/animations.component'),
    title: 'Animations · ng-playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];