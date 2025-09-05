import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { CANDLE_INFORMATION_Request_Write_to_Session_URL, CANDLE_INFORMATION_URL, CANDLES_AddNewProduct_URL, CANDLES_By_Filter_URL, CANDLES_By_Search_URL, CANDLES_By_Tag_URL, CANDLES_URL } from '../../Common_Configuration/Constant/urls';
import { Tag } from '../../Common_Configuration/Models/Tag';
import { Selected_Candle } from '../../Common_Configuration/Models/Selected_candles';
import { AddNewProduct } from '../../Common_Configuration/Models/AddNewProduct';


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
  // CANDLE_INFORMATION_Request_Write_to_Session_URL
  setCandleInformationToSession(selected_candles: Selected_Candle): Observable<Selected_Candle> {
    return this.http.post<Selected_Candle>(CANDLE_INFORMATION_Request_Write_to_Session_URL, selected_candles, { withCredentials: true }); 
  };

  setCandleInformationToLocalStorageOfBrownser(selected_candles: Selected_Candle){
    let existing_candle_name = localStorage.getItem('Selected_candles_name');
    let existing_quatity = localStorage.getItem('Selected_candles_Quatity');
    let existing_price = localStorage.getItem('Selected_candles_Price');
    let existing_image = localStorage.getItem('Selected_candles_Image');

    if(existing_candle_name === null || existing_quatity === null || existing_price === null || existing_image === null) {
      localStorage.setItem('Selected_candles_name',selected_candles.candle_name?? ''); // using localStorage to store session ID
      localStorage.setItem('Selected_candles_Quatity',(selected_candles.quatity?? '').toString());
      localStorage.setItem('Selected_candles_Price',(selected_candles.price?? '').toString());
      localStorage.setItem('Selected_candles_Image',(selected_candles.image?? '').toString());
    }
    else {
      localStorage.setItem('Selected_candles_name', existing_candle_name + ':' + selected_candles.candle_name); // using localStorage to store session ID
      localStorage.setItem('Selected_candles_Quatity', existing_quatity + ':' + (selected_candles.quatity?? '').toString());
      localStorage.setItem('Selected_candles_Price', existing_price + ':' + (selected_candles.price?? '').toString());
      localStorage.setItem('Selected_candles_Image', existing_image + ':' + (selected_candles.image?? '').toString());
    }
    
    
    // sessionStorage.setItem('Currentuser', Username);
    // sessionStorage.setItem('isAdminRights', JSON.stringify(isAdminRights));
    // document.cookie = `SessionID=${SessionID}; path=/;`; // using cookies to store session ID
    // document.cookie = `Currentuser=${Username}; path=/;`; // using cookies to store username
  }

  getCandleInformationFromLocalStorageOfBrownser() : Selected_Candle {
    let existing_candle_name = localStorage.getItem('Selected_candles_name');
    let existing_quatity = localStorage.getItem('Selected_candles_Quatity');
    let existing_price = localStorage.getItem('Selected_candles_Price');
    let existing_image = localStorage.getItem('Selected_candles_Image');
    console.log("existing_candle_name is ", existing_candle_name);
    console.log("existing_quatity is ", existing_quatity);
    console.log("existing_price is ", existing_price);
    console.log("existing_image is ", existing_image);
    if(existing_candle_name === null || existing_quatity === null || existing_price === null || existing_image === null) {
      return {candle_name: '', quatity: 0, price: "0VND", image: ''};
    }
    else {
      let candle_name_array = existing_candle_name.split(':');
      let quatity_array = existing_quatity.split(':');
      let price_array = existing_price.split(':');
      let image_array = existing_image.split(':');
      console.log("candle_name_array is ", candle_name_array);
      console.log("quatity_array is ", quatity_array);  
      console.log("price_array is ", price_array);
      console.log("image_array is ", image_array);

      return {
        candle_name_array: candle_name_array,
        quatity_array: quatity_array.map(q => parseInt(q)),
        price_array: price_array,
        image_array: image_array
      };
    }
    
  }

  setAddNewProduct(NewProductToBeAdded: AddNewProduct): Observable<AddNewProduct> {
    return this.http.post<AddNewProduct>(CANDLES_AddNewProduct_URL, NewProductToBeAdded, { withCredentials: true }); 
  };
  
}
