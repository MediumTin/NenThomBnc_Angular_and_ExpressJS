import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { CANDLES_By_Filter_URL, CANDLES_By_Search_URL, CANDLES_By_Tag_URL, CANDLES_URL } from '../../Common_Configuration/Constant/urls';

@Injectable({
  providedIn: 'root'
})
export class CandlesServiceService {
  constructor(private http:HttpClient) { }
  getAllCandles(): Observable<Candles[]> {
    return this.http.get<Candles[]>(CANDLES_URL);
  }

  getAllCandlesByTag(tag: string): Observable<Candles[]> {
    return tag === "All" ?
      this.getAllCandles() :  // in case of dont have specific request tag, return all candles
      this.http.get<Candles[]>(CANDLES_By_Tag_URL + tag); // in case of have specific request tag, return candles by tag
  }

  getAllCandlesByFilter(filter: string): Observable<Candles[]> {
    return filter === "All" ?
      this.getAllCandles() :  // in case of dont have specific request tag, return all candles
      this.http.get<Candles[]>(CANDLES_By_Filter_URL); // in case of have specific request tag, return candles by tag
  }

  getAllCandlesBySearchTerm(searchTerm: string) {
    return this.http.get<Candles[]>(CANDLES_By_Search_URL + searchTerm);
  }
  
}
