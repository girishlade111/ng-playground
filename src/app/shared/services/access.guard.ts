import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessControlService } from './access-control.service';

export const accessGuard: CanActivateFn = () => {
  const accessControl = inject(AccessControlService);
  const router = inject(Router);

  if (accessControl.accessGranted()) {
    return true;
  }

  return router.createUrlTree(['/router/denied']);
};