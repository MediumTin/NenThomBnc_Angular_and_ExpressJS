import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocket_URL } from '../../Common_Configuration/Constant/urls';
@Injectable({
  providedIn: 'root'
})
export class PaymentWebSocketService {
  private ws!: WebSocket;
  constructor() { }
  connect(orderId: string): Observable<any> {
    return new Observable(observer => {
      this.ws = new WebSocket(`${WebSocket_URL}`);

      this.ws.onopen = () => {
        // subscribe theo orderId
        this.ws.send(JSON.stringify({ orderId }));
      };

      this.ws.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };

      this.ws.onerror = (err) => {
        observer.error(err);
      };
    this.ws.onclose = () => {
        observer.complete();
      };
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
