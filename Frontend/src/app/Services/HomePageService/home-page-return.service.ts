import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL} from '../../Common_Configuration/Constant/urls';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
@Injectable({
  providedIn: 'root'
})
export class HomePageReturnService {
  constructor(private http: HttpClient) {}
  

  ReturnHomePageData(): Observable<UserInformation[]> { // ✅ Ensure it returns an Observable
    return this.http.get<UserInformation[]>(BASE_URL, { withCredentials: true }); // Replace `any` with the actual data type
  }

  

}
