import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { CANDLE_INFORMATION_URL, CANDLES_By_Filter_URL, CANDLES_By_Search_URL, CANDLES_By_Tag_URL, CANDLES_URL } from '../../Common_Configuration/Constant/urls';
import { Tag } from '../../Common_Configuration/Models/Tag';

@Injectable({
  providedIn: 'root'
})
export class CandlesServiceService {
  constructor(private http:HttpClient) { }
  getAllCandles(): Observable<Candles[]> {
    return this.http.get<Candles[]>(CANDLES_URL, { withCredentials: true });
  }

  getAllCandlesByTag(tag: string): Observable<Candles[]> {
    return tag === "All" ?
      this.getAllCandles() :  // in case of dont have specific request tag, return all candles
      this.http.get<Candles[]>(CANDLES_By_Tag_URL + tag, { withCredentials: true }); // in case of have specific request tag, return candles by tag
  }

  getAllCandlesByFilter(filter: any): Observable<Candles[]> {
    return filter === "All" ?
      this.getAllCandles() :  // in case of dont have specific request tag, return all candles
      this.http.post<Candles[]>(CANDLES_By_Filter_URL, filter, { withCredentials: true }); // in case of have specific request tag, return candles by tag
  }

  getAllCandlesBySearchTerm(searchTerm: string) {
    return this.http.get<Candles[]>(CANDLE_INFORMATION_URL +'/'+  searchTerm, { withCredentials: true });
  }

   getCandlesByID_for_DetailInfo(searchTerm: string) {
    return this.http.get<Candles[]>(CANDLE_INFORMATION_URL +'/'+  searchTerm, { withCredentials: true });
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(CANDLES_By_Tag_URL, { withCredentials: true });
  }
  
}
