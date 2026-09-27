import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import FormsComponent from './forms.component';

describe('FormsComponent async username validator', () => {
  let component: FormsComponent;
  let fixture: ComponentFixture<FormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function username() {
    const control = component.asyncForm.get('username');
    if (!control) throw new Error('username control missing');
    return control;
  }

  it('flags a taken username after the real 300ms debounce + 800ms check', fakeAsync(() => {
    username().setValue('admin');
    expect(component.asyncUsernameStatus()).toBe('checking');
    // debounce window not yet elapsed: no server call, no verdict
    tick(299);
    expect(component.asyncValidatorCallCount()).toBe(0);
    expect(component.asyncUsernameStatus()).toBe('checking');
    // debounce elapses (300ms) -> call starts; check takes 800ms more
    tick(1);
    expect(component.asyncValidatorCallCount()).toBe(1);
    tick(799);
    expect(username().hasError('usernameTaken')).toBeFalse();
    tick(1);
    expect(username().hasError('usernameTaken')).toBeTrue();
    expect(component.asyncUsernameStatus()).toBe('taken');
  }));

  it('flags an available username as available', fakeAsync(() => {
    username().setValue('uniqueuser999');
    tick(300 + 800);
    expect(username().hasError('usernameTaken')).toBeFalse();
    expect(component.asyncUsernameStatus()).toBe('available');
  }));

  it('cancels the pending check when the user keeps typing (one call total)', fakeAsync(() => {
    username().setValue('adm');
    tick(200); // inside debounce window of first keystroke burst
    username().setValue('admi');
    tick(200); // first check cancelled, second still debouncing
    username().setValue('admin');
    tick(200);
    expect(component.asyncValidatorCallCount()).toBe(0);
    tick(100); // final 300ms debounce elapses -> exactly one server call
    expect(component.asyncValidatorCallCount()).toBe(1);
    tick(800);
    expect(username().hasError('usernameTaken')).toBeTrue();
    expect(component.asyncUsernameStatus()).toBe('taken');
  }));

  it('does not call the server for values shorter than 3 chars', fakeAsync(() => {
    username().setValue('ab');
    tick(2000);
    expect(component.asyncValidatorCallCount()).toBe(0);
    expect(component.asyncUsernameStatus()).toBe('idle');
  }));
});
