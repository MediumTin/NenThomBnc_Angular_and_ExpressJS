import { TestBed } from '@angular/core/testing';

import { IndentificationService } from './indentification.service';

describe('IndentificationService', () => {
  let service: IndentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
