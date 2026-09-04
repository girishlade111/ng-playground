import { Routes } from '@angular/router';
import { accessGuard } from '../../shared/services/access.guard';

export const ROUTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./router.component'),
    title: 'Router · ng-playground',
  },
  {
    path: 'protected',
    loadComponent: () => import('./protected.component'),
    canActivate: [accessGuard],
    title: 'Protected Route · ng-playground',
  },
  {
    path: 'denied',
    loadComponent: () => import('./access-denied.component'),
    title: 'Access Denied · ng-playground',
  },
];