import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLEAR_SESSION_ID, DESTROY_SESSION_DATA, DESTROY_SESSION_ID, GET_SESSION_DATA, GET_SESSION_ID } from '../../Common_Configuration/Constant/urls';

@Injectable({
  providedIn: 'root'
})
export class SessionHandlingService {

  constructor(private http:HttpClient) { }

  GetSessionData(){ // ✅ Ensure it returns an Observable
    this.http.get<any>(GET_SESSION_DATA).subscribe(
      (response) => {
        console.log("HTTP POST request successful:", response);
        return response;
      },
      (error) => {
        console.error("HTTP POST request failed:", error);
        return error;
      }
    );
      
  }

  ClearSessionID(){ // ✅ Ensure it returns an Observable
    this.http.get<any>(CLEAR_SESSION_ID).subscribe(
      (response) => {
        console.log("HTTP POST request successful:", response);
        return response;
      },
      (error) => {
        console.error("HTTP POST request failed:", error);
        return error;
      }
    );
  }

  DestroySessionData(){ // ✅ Ensure it returns an Observable
    this.http.get<any>(DESTROY_SESSION_DATA).subscribe(
      (response) => {
        console.log("HTTP POST request successful:", response);
        return response;
      },
      (error) => {
        console.error("HTTP POST request failed:", error);
        return error;
      }
    );
  }

  GetSessionID(){ // ✅ Ensure it returns an Observable
    this.http.get<any>(GET_SESSION_ID).subscribe(
      (response) => {
        console.log("HTTP POST request successful:", response);
        return response;
      },
      (error) => {
        console.error("HTTP POST request failed:", error);
        return error;
      }
    );
  }

  DestroySessionID(){ // ✅ Ensure it returns an Observable
    this.http.get<any>(DESTROY_SESSION_ID).subscribe(
      (response) => {
        console.log("HTTP POST request successful:", response);
        return response;
      },
      (error) => {
        console.error("HTTP POST request failed:", error);
        return error;
      }
    );
  }
  
}
