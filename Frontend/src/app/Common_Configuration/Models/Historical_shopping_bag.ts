import { Selected_Candle } from "./Selected_candles";

export class HistoricalShoppingBag {
    Username!:string;
    Email!:string;
    Visa_number!:string;
    Visa_valid_date!:string;
    Visa_cvv!:string;
    Nation_buyer!:string;
    Nation_zip_buyer!:string;
    Nation_state_buyer!:string;
    VAT_number_buyer!:string;
    Total_Price_Before_VAT!:string;
    Total_VAT!:string;
    Total_Price_After_VAT!:string;
    Selected_List!:string[];
    Selected_List_Object?: Array<Selected_Candle>;
    Payment_Method?:string;
    Price_currency?:string;
    PayPal_order_id?:string;
  }