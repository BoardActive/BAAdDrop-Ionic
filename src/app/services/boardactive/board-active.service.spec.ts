import { TestBed } from '@angular/core/testing';

import { BoardActiveService } from './board-active.service';

describe('BoardActiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardActiveService = TestBed.get(BoardActiveService);
    expect(service).toBeTruthy();
  });
});
