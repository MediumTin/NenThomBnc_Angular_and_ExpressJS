import { TestBed } from '@angular/core/testing';

import { CandlesServiceService } from './candles-service.service';

describe('CandlesServiceService', () => {
  let service: CandlesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandlesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
