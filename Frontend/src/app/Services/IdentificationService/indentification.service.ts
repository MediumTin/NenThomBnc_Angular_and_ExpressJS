import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CANDLES_By_Filter_URL, CANDLES_URL, CHECK_CURRENT_USER_URL, LOGIN_HANDLING_URL} from '../../Common_Configuration/Constant/urls';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class IndentificationService {
  constructor(private http:HttpClient, private router:Router) { }
  RequestUserLogin() {
    console.log("RequestUserLogin successfully");
    this.http.get(LOGIN_HANDLING_URL).subscribe(
      (response) => {
        console.log("HTTP GET request successful:", response);
      },
      (error) => {
        console.error("HTTP GET request failed:", error);
      }
    );
    this.router.navigate(['/login_handling']);
  }

  CheckIdentification(): Observable<UserInformation[]>{
    console.log("It is checking identification");
    return this.http.get<UserInformation[]>(CHECK_CURRENT_USER_URL)
    // return this.http.get<String>(CHECK_CURRENT_USER_URL);;
  }

  // getAllCandles(): Observable<Candles[]> {
  //   return this.http.get<Candles[]>(CANDLES_URL);
  // }
}
