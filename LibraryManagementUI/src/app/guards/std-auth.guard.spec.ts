import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { stdAuthGuard } from './std-auth.guard';

describe('stdAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => stdAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
