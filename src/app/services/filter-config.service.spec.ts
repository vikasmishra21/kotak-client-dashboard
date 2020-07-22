import { TestBed } from '@angular/core/testing';

import { FilterConfigService } from './filter-config.service';

describe('FilterConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterConfigService = TestBed.get(FilterConfigService);
    expect(service).toBeTruthy();
  });
});
