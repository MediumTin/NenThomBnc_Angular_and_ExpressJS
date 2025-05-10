import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL} from '../Common_Configuration/Constant/urls';
@Injectable({
  providedIn: 'root'
})
export class HomePageReturnService {
  constructor(private http: HttpClient) {}
  

  ReturnHomePageData(): Observable<any> { // ✅ Ensure it returns an Observable
    return this.http.get<any>(BASE_URL); // Replace `any` with the actual data type
  }

  

}
