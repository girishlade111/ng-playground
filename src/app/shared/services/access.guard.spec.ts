import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { accessGuard } from './access.guard';
import { AccessControlService } from './access-control.service';

describe('accessGuard', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  }

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      accessGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it('should allow activation when access is granted', () => {
    setup();
    TestBed.inject(AccessControlService).grantAccess();
    expect(runGuard()).toBeTrue();
  });

  it('should redirect to /router/denied when access is not granted', () => {
    setup();
    TestBed.inject(AccessControlService).revokeAccess();
    const result = runGuard();
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/router/denied');
  });
});
