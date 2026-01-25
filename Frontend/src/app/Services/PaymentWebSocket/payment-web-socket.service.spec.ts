import { TestBed } from '@angular/core/testing';

import { PaymentWebSocketService } from './payment-web-socket.service';

describe('PaymentWebSocketService', () => {
  let service: PaymentWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
