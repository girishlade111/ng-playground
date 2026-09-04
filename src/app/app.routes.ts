import { Routes } from '@angular/router';
import { accessGuard } from './shared/services/access.guard';
import { taskResolver } from './features/router/task.resolver';

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
    path: 'reactive-forms',
    loadComponent: () => import('./features/forms/reactive-forms-example.component'),
    title: 'Reactive Forms Example · ng-playground',
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
    path: 'ssr',
    loadComponent: () => import('./features/ssr-hydration/ssr-hydration.component'),
    title: 'SSR Hydration · ng-playground',
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
    path: 'router/protected',
    loadComponent: () => import('./features/router/protected.component'),
    canActivate: [accessGuard],
    title: 'Protected Route · ng-playground',
  },
  {
    path: 'router/denied',
    loadComponent: () => import('./features/router/access-denied.component'),
    title: 'Access Denied · ng-playground',
  },
  {
    path: 'router/task/:id',
    loadComponent: () => import('./features/router/task-detail.component'),
    resolve: { task: taskResolver },
    title: 'Task Detail · ng-playground',
  },
  {
    path: 'animations',
    loadComponent: () => import('./features/animations/animations.component'),
    title: 'Animations · ng-playground',
  },
  {
    path: 'zoneless',
    loadComponent: () => import('./features/zoneless/zoneless.component'),
    title: 'Zoneless Change Detection · ng-playground',
  },
  {
    path: '**',
    redirectTo: '',
  },
];