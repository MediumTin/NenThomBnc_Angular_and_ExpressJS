export class Coupon{
  Coupon_id!:string;
  Code!:string;
  Discount_type!:string;
  Discount_value!:string;
  MinOrderValue!:string;
  MaxDiscountValue!:string;
  ValidFrom!:string;
  ValidTo!:string;
  UsageLimit!:number;
  LimitForPerson!:string;
  StatusActivation!:string;
}
