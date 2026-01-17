import { Injectable } from '@angular/core';
import { User } from '../../Common_Configuration/Models/User';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADMIN_Coupon_URL, ADMIN_Customer_URL, ADMIN_Inventory_URL, ADMIN_OrderStatus_URL, ADMIN_Warehouse_URL } from '../../Common_Configuration/Constant/urls';
import { Coupon } from '../../Common_Configuration/Models/Coupon';
import { Inventory } from '../../Common_Configuration/Models/Inventory';
import { Warehouse } from '../../Common_Configuration/Models/Warehouse';
import { Order_status } from '../../Common_Configuration/Models/Order_status';
import { Order_status_detail } from '../../Common_Configuration/Models/Order_status_detail';
import { Customer } from '../../Common_Configuration/Models/Customer';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http:HttpClient) { }
  getAllCustomer(): Observable<Customer[]> {
      return this.http.get<Customer[]>(ADMIN_Customer_URL, { withCredentials: true });
    }

  getAllCoupon(): Observable<Coupon[]> {
      return this.http.get<Coupon[]>(ADMIN_Coupon_URL, { withCredentials: true });
    }

  UpdateCouponStatusActivation(updatedCoupon: Coupon[]): Observable<Coupon[]> {
    return this.http.post<Coupon[]>(ADMIN_Coupon_URL, updatedCoupon, { withCredentials: true }); // in case of have specific request tag, return candles by tag
  }

  getAllInventory(): Observable<Inventory[]> {
      return this.http.get<Inventory[]>(ADMIN_Inventory_URL, { withCredentials: true });
    }

  getAllWarehouse(): Observable<Warehouse[]> {
      return this.http.get<Warehouse[]>(ADMIN_Warehouse_URL, { withCredentials: true });
    }

  getAllOrderStatus(): Observable<Order_status[]> {
      return this.http.get<Order_status[]>(ADMIN_OrderStatus_URL, { withCredentials: true });
    }

  UpdateAllOrderStatus(UpdatedOrderStatus: Order_status[]): Observable<Order_status[]> {
      return this.http.post<Order_status[]>(ADMIN_OrderStatus_URL, UpdatedOrderStatus, { withCredentials: true });
    }
  
}
