import { TestBed } from '@angular/core/testing';

import { FilteredProductService } from './filtered-product.service';

describe('FilteredProductService', () => {
  let service: FilteredProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteredProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
