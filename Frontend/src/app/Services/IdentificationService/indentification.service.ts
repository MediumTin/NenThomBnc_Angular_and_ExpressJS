import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CANDLES_By_Filter_URL, CANDLES_URL, CHECK_CURRENT_USER_URL, LOGIN_HANDLING_Login_URL, LOGIN_HANDLING_Register_URL, LOGIN_HANDLING_URL} from '../../Common_Configuration/Constant/urls';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class IndentificationService {
  Global_SessionID: string = "";	
  // isUserIdentifiedMain: boolean = false;
  private isUserIdentifiedMainSubject = new BehaviorSubject<boolean>(false);
  isUserIdentifiedMain = this.isUserIdentifiedMainSubject.asObservable();
  constructor(private http:HttpClient, private router:Router) {  }

  RequestUserLogin(userData: any): Observable<UserInformation[]> {
    console.log("RequestUserLogin called");
    // return this.http.post<UserInformation[]>(LOGIN_HANDLING_Login_URL, userData);
    return this.http.post<UserInformation[]>(LOGIN_HANDLING_Login_URL, userData, { withCredentials: true });
  }
  // this.router.navigate(['/login_handling']);
  // }

//    SetisUserIdentifiedMain(isUserIdentifiedMainLocal: boolean) {
//     this.isUserIdentifiedMain = isUserIdentifiedMainLocal;
//   }

//   GetisUserIdentifiedMain(): boolean {
//     return this.isUserIdentifiedMain;
// }
SetisUserIdentifiedMain(isUserIdentifiedMainLocal: boolean) {
    this.isUserIdentifiedMainSubject.next(isUserIdentifiedMainLocal);
  }

  GetisUserIdentifiedMain(): boolean {
    return this.isUserIdentifiedMainSubject.value;
  }

 SetSessionID(SessionID: string, Username: string) {
    this.Global_SessionID = SessionID;
    // localStorage.setItem('SessionID', SessionID); // using localStorage to store session ID
    // localStorage.setItem('Currentuser', Username);
    sessionStorage.setItem('SessionID', SessionID); // using sessionStorage to store session ID
    sessionStorage.setItem('Currentuser', Username);
    // document.cookie = `SessionID=${SessionID}; path=/;`; // using cookies to store session ID
    // document.cookie = `Currentuser=${Username}; path=/;`; // using cookies to store username
  }
  
// GetSessionID(): { SessionID: string; Username: string} {
//   let sessionId = "";
//   let username = "";

//   if (typeof document !== 'undefined') {
//     const cookies = document.cookie.split(';');
//     for (const cookie of cookies) {
//       const [key, value] = cookie.trim().split('=');
//       if (key === 'SessionID') sessionId = value ?? "";
//       if (key === 'Currentuser') username = value ?? "";
//     }
//   }

//   console.log("Session ID is: ", sessionId, "Username is: ", username);
//   return { SessionID: sessionId, Username: username };
// }

GetSessionID(): { SessionID: string; Username: string } {
  let sessionId = "";
  let username = "";

  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionId = sessionStorage.getItem('SessionID') ?? "";
    username = sessionStorage.getItem('Currentuser') ?? "";
  }

  console.log("Session ID is: ", sessionId, "Username is: ", username);
  return { SessionID: sessionId, Username: username };
}

  RequestUserRegister(userData: any) {
  console.log("RequestUserRegister successfully");
  this.http.post(LOGIN_HANDLING_Register_URL, userData).subscribe(
    (response) => {
      console.log("HTTP POST request successful:", response);
    },
    (error) => {
      console.error("HTTP POST request failed:", error);
    }
  );
  // this.router.navigate(['/login_handling']);
  }

  CheckIdentification(): Observable<UserInformation[]>{
    console.log("It is checking identification");
    console.log("RegisterUser successfully",`${this.GetSessionID()}`);
    return this.http.get<UserInformation[]>(CHECK_CURRENT_USER_URL)
    // return this.http.get<String>(CHECK_CURRENT_USER_URL);;
  }
}
