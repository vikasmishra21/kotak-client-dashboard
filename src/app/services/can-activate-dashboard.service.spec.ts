import { TestBed } from '@angular/core/testing';

import { CanActivateDashboardService } from './can-activate-dashboard.service';

describe('CanActivateDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanActivateDashboardService = TestBed.get(CanActivateDashboardService);
    expect(service).toBeTruthy();
  });
});
