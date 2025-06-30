import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Candles } from '../../Common_Configuration/Models/Candles';

@Injectable({
  providedIn: 'root'
})
export class FilteredProductService {

  constructor() { }
  private filterChangedSource = new BehaviorSubject<any>(null);
  filterChanged$ = this.filterChangedSource.asObservable();

  notifyFilterChanged(data: Candles[]) {
    this.filterChangedSource.next(data);
  }
}
