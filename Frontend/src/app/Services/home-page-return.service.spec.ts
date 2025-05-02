import { TestBed } from '@angular/core/testing';

import { HomePageReturnService } from './home-page-return.service';

describe('HomePageReturnService', () => {
  let service: HomePageReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomePageReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
