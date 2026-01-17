import { Order_status_detail } from "./Order_status_detail";

export class Order_status{
  OrderId!:string;
  CustomerId!:string;
  CustomerUsername!:string;
  TotalAmount!:string;
  OrderStatus!:string;
  OrderDate!:string;
  details!:Order_status_detail[];
}

