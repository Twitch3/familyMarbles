import { TestBed, inject } from '@angular/core/testing';

import { GameConstantsService } from './game-constants.service';

describe('GameConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameConstantsService]
    });
  });

  it('should be created', inject([GameConstantsService], (service: GameConstantsService) => {
    expect(service).toBeTruthy();
  }));
});
