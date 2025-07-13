import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { CANDLE_INFORMATION_Request_Write_to_Session_URL, PAYMENT_HANDLING_Specific_Handling_URL, PAYMENT_HANDLING_URL } from '../../Common_Configuration/Constant/urls';
import { HistoricalShoppingBag } from '../../Common_Configuration/Models/Historical_shopping_bag';
import { Selected_Candle } from '../../Common_Configuration/Models/Selected_candles';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { }
 // 
  GetShoppingBagOfCurrentUser(): Observable<UserInformation[]> {
      console.log("GetShoppingBagOfCurrentUser called");
      // return this.http.post<UserInformation[]>(LOGIN_HANDLING_Login_URL, userData);
      return this.http.get<UserInformation[]>(PAYMENT_HANDLING_URL, { withCredentials: true });
    }

  SetOrderCompleted_and_Confirmed_via_mail(payment_data: HistoricalShoppingBag): Observable<any> {
      console.log("SetOrderCompleted_and_Confirmed_via_mail successfully");
      return this.http.post<any>(PAYMENT_HANDLING_Specific_Handling_URL, payment_data, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
    }

}
