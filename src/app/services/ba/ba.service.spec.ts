import { TestBed } from '@angular/core/testing';

import { BAService } from './ba.service';

describe('BAService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BAService = TestBed.get(BAService);
    expect(service).toBeTruthy();
  });
});
