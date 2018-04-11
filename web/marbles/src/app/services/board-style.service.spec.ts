import { TestBed, inject } from '@angular/core/testing';

import { BoardStyleService } from './board-style.service';

describe('BoardStyleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardStyleService]
    });
  });

  it('should be created', inject([BoardStyleService], (service: BoardStyleService) => {
    expect(service).toBeTruthy();
  }));
});
