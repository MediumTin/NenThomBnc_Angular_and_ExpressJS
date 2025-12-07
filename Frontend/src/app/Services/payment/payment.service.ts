import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { CANDLE_INFORMATION_Request_Write_to_Session_URL, Create_Order_URL, PAYMENT_HANDLING_Merge_local_storage_and_DB, PAYMENT_HANDLING_Specific_Handling_URL, PAYMENT_HANDLING_URL } from '../../Common_Configuration/Constant/urls';
import { HistoricalShoppingBag } from '../../Common_Configuration/Models/Historical_shopping_bag';
import { Selected_Candle } from '../../Common_Configuration/Models/Selected_candles';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
   private scriptLoaded = false;
  constructor(private http:HttpClient) { }
  loadPaypalScript(clientId: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      document.body.appendChild(script);
    });
  }
 // Basic payment method 1: Get shopping bag of current user from server
  GetShoppingBagOfCurrentUser(): Observable<UserInformation[]> {
      console.log("GetShoppingBagOfCurrentUser called");
      // return this.http.post<UserInformation[]>(LOGIN_HANDLING_Login_URL, userData);
      return this.http.get<UserInformation[]>(PAYMENT_HANDLING_URL, { withCredentials: true });
    }

  // Basic payment method 2:  Merge shopping bag from local storage to server side
  Get_and_merge_ShoppingBag_FromLocalStorage_ToServer(personalShoppingBagFromLocalStorage: Selected_Candle): Observable<UserInformation[]> {
    return this.http.post<UserInformation[]>(PAYMENT_HANDLING_Merge_local_storage_and_DB,personalShoppingBagFromLocalStorage, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
  }

  // Basic payment method 3: Set order as completed and send confirmation email to user
  SetOrderCompleted_and_Confirmed_via_mail(payment_data: HistoricalShoppingBag): Observable<any> {
      console.log("SetOrderCompleted_and_Confirmed_via_mail successfully");
      return this.http.post<any>(PAYMENT_HANDLING_Specific_Handling_URL, payment_data, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  // Advanced payment method: Create PayPal order
  Create_PayPal_Order(payment_data: HistoricalShoppingBag): Observable<any> {
    console.log("Create_PayPal_Order successfully");
    return this.http.post<any>(Create_Order_URL, payment_data, { 
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
