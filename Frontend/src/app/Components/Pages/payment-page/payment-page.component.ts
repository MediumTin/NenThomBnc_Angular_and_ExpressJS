import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { PaymentService } from '../../../Services/payment/payment.service';
import { HistoricalShoppingBag } from '../../../Common_Configuration/Models/Historical_shopping_bag';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { type } from 'node:os';
import { Selected_Candle } from '../../../Common_Configuration/Models/Selected_candles';
import { empty } from 'rxjs';
import { Check_status_Order_VNPay} from '../../../Common_Configuration/Constant/urls';
import { firstValueFrom } from 'rxjs';

declare var paypal: any;

@Component({
  selector: 'app-payment-page',
  // imports: [TitleComponent, OrderItemsListComponent, PaypalButtonComponent, CommonModule, MapComponent],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  counter_to_server : number = 0;
  paymentForm!: FormGroup; // Use definite assignment
  // historicalBag: HistoricalShoppingBag = new HistoricalShoppingBag();
  Current_Counter : number = 0;
  PersonalShoppingBags : string = "";
  SelectedFromPersonalShoppingBags: Array<Selected_Candle> = []; // To store selected items from personal shopping bags
  SelectedFromPersonalShoppingBags_TO_SERVER :string[] = []; // type is 
  SelectedFromPersonalShoppingBags_In_USD : Array<Selected_Candle> = []; // type is
  counter_for_selected_items: number = 0; // To count the number of selected items
  account: string = "";
  isDivButtonActive: string[] = [];
  isDivImageActive: string[] = [];
  total_price_before_VAT_in_USD = 0;
  VAT_Price_in_USD = 0; // Assuming VAT is 20%
  total_price_after_VAT_in_USD = 0;
  isButtonBackgroundChecked: boolean[] = []; // To handle the background color of the button
  isConfirmation_Box_Visible: boolean = false; // To handle the visibility of the confirmation box
  isConfirmation_Box_child_Visible: boolean = false; // To handle the visibility of the confirmation box child
  isPayPal_Payment_Visible: boolean = false; // To handle the visibility of PayPal payment section
  isMain_body_Visible: boolean = true; // To handle the visibility of the main body
  isMain_body_1_Visible: boolean = true; // To handle the visibility of the main body 1
  isMain_body_2_Visible: boolean = true; // To handle the visibility of the main body 2
  GLOBAL_label_for_total_price : string = "0.00"; // Default value for total price before VAT
  GLOBAL_label_for_total_VAT_price : string = "0.00"; // Default value for total VAT price
  GLOBAL_label_for_total_payment : string = "0.00"; // Default value for total payment after VAT
  isCash_Payment_Visible: boolean = false;
  isVNPay_Payment_Visible: boolean = false;
  isMomo_Payment_Visible: boolean = false;
  // VNPay_OrderId : string = "";
  exchange_Rate_VND_to_USD: number = 1; // Default value for exchange rate VND to USD
  exchange_Rate_VND_to_EUR: number = 1; // Default value for exchange rate VND to EUR
  isInternetBanking_Payment_Visible: boolean = false;
  orderId_VNPay : string = "";
  orderId_Momo : string = "";
  Price_currency_selected: number = 1; // Default value for price currency 1 is VND, 2 is USD, 3 is EUR
  Payment_Method_selected: number = 1; // Default value for payment method 1 is Cash on delivery, 2 is PayPal, 3 is VNPAY, 4 is Momo, 5 is Internet Banking
  Current_Username: string = ""; // To store the current username
  total_price_before_VAT: number = 0;
  VAT_Price: number = 0;
  total_price_after_VAT: number = 0;
  total_price_before_VAT_confirmed: any;
  VAT_Price_confirmed: any;
  total_price_after_VAT_confirmed: any;
  isTrigger_Paypal_JS_SDK: boolean = false;
  isFirstCalculate_Total_Price: boolean = true;
  orderID_from_PayPal: string = "";
  bankCode_for_VNPay: string = ""; // default logic bankcode selection will performed by VNPay, not by bussiness logic
  timer: any;
  AllListToServer2: HistoricalShoppingBag = {
    Username: '',
    Email: '',
    Visa_number: '',
    Visa_valid_date: '',
    Visa_cvv: '',
    Nation_buyer: '',
    Nation_zip_buyer: '',
    Nation_state_buyer: '',
    VAT_number_buyer: '',
    Total_Price_Before_VAT: '',
    Total_VAT: '',
    Total_Price_After_VAT: '',
    Selected_List: [],
    Price_currency: ''
  };
  

  constructor(
    private http:HttpClient,
    private fb: FormBuilder, 
    private router:Router, 
    private identification: IndentificationService, 
    private paymentService: PaymentService,
    private candlesService : CandlesServiceService
  ) {
    // this.SelectedFromPersonalShoppingBags = "";
    const sessionInfo = this.identification.GetSessionID();
    if (sessionInfo.Username != "") {
      this.Current_Username = sessionInfo.Username;
      console.log("Current_Username is ", this.Current_Username);
      this.identification.SetisUserIdentifiedMain(true);
      console.log("User has identified yet in payment component");
      const selectedCandle: Selected_Candle = this.candlesService.getCandleInformationFromLocalStorageOfBrownser();
      console.log("selectedCandle in payment component is ", selectedCandle);
      console.log("selected_name in payment component is ", selectedCandle.candle_name_array);
      console.log("selected_quatity in payment component is ", selectedCandle.quatity_array);
      console.log("selected_price in payment component is ", selectedCandle.price_array);
      console.log("selected_image in payment component is ", selectedCandle.image_array);

      // Scenario 1: If want user can access the website without login
      this.paymentService.Get_and_merge_ShoppingBag_FromLocalStorage_ToServer(selectedCandle).subscribe((userInfo) => {
        console.log("UserInfo is ", userInfo);  
          if (userInfo[0]?.status == "Session is timeout") {
            console.log("Session is timeout");
            this.identification.ClearSessionStorage();
            this.identification.SetisUserIdentifiedMain(false);
            this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
          } else {
            this.PersonalShoppingBags = JSON.parse(userInfo[0]?.personal_shopping_bag ?? ""); // data in object
            this.account = userInfo[0]?.Currentuser ?? "";
            console.log("type of personal_shopping_bag ", typeof this.PersonalShoppingBags);
            console.log("Personal shopping bag is ",this.PersonalShoppingBags);
            console.log("this.PersonalShoppingBags[0] is ", (this.PersonalShoppingBags[0].split(","))[3]);
            this.candlesService.ClearAllDataInLocalStorageOfBrownser(); // Clear all data in local storage of browser after merge to server
          }
      });

      this.paymentService.Get_Exchange_Rate().subscribe((data: any) => {
        console.log("Exchange rate info:", data);
        this.exchange_Rate_VND_to_USD = data.conversion_rates.USD;
        this.exchange_Rate_VND_to_EUR = data.conversion_rates.EUR;

      });

      // this.bankCode_for_VNPay = "NCB"; // Default bank code for VNPay - Detail implement later

    } else {
      // User is not identified, handle accordingly - request login
      console.log("User has not identified yet in app component");
      this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      
    }
   }

  // onSelectChange(event: Event) {
  //     const value = (event.target as HTMLSelectElement).value;
  //     if(Number(value) == 4){
  //       this.isVNPay_Payment_Visible = true;
  //     }
  //     else {
  //       this.isVNPay_Payment_Visible = false;
  //     }
  //     console.log(value);
  // }
  ngAfterViewInit(): void {
    this.Current_Counter = 0;
    this.isDivButtonActive[0] = "active";
    this.isDivImageActive[0] = "carousel-item active";
    this.isButtonBackgroundChecked[0] = true;
  }

    startPolling_Check_Order_status_VNPay() {
      console.log('START POLLING'); 
    this.timer = setInterval(async () => {
      console.log('CALL API'); 
      console.log("Response from server orderId_VNPay is ", this.orderId_VNPay);
      // const res: any = await this.http.get(`${Check_status_Order_VNPay}?orderId=${this.orderId_VNPay}`,{ withCredentials: true });
      const res: any = await firstValueFrom(this.paymentService.VNPay_Polling_to_QueryyDrr_to_Backend(this.orderId_VNPay));
      console.log("Response from server VNpay_Url is ", res);
      console.log("Response from server VNpay_Url status_order_vnpay_return is ", res.status_order_vnpay_return);
      console.log("Response from server VNpay_Url status_order_vnpay_ipn is ", res.status_order_vnpay_ipn);
      console.log("Response from server VNpay_Url is ", res.requested_orderID);
      if (res.status_order_vnpay_return === 'PAID_With_VNPay_Return'){
        if(res.status_order_vnpay_ipn === 'PAID_PAYMENT_With_VNPay_IPN') {
          // clearInterval(this.timer);
          this.stopPolling();
          alert('Payment with VNPay successfully');
          this.Passed_Confirmation();
          this.orderId_VNPay = "";
        }
        else if (res.status_order_vnpay_ipn === 'FAILED_PAYMENT_With_VNPay_IPN') {
          // clearInterval(this.timer);
          this.stopPolling();
          alert('Payment with VNPay Unsuccessfully. Please try again');
          this.orderId_VNPay = "";
        }
        else if (res.status_order_vnpay_ipn === 'INCONSISTENCY_AMOUNT_VNPay_IPN') {
          // clearInterval(this.timer);
          this.stopPolling();
          alert('Inconsistency amount. Please try again');
          this.orderId_VNPay = "";
        }
        else if (res.status_order_vnpay_ipn === 'INCONSISTENCY_ORDER_VNPay_IPN') {
          // clearInterval(this.timer);
          this.stopPolling();
          alert('Inconsistency order. Please try again');
          this.orderId_VNPay = "";
        }
      }
    }, 3000);
  }

  stopPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('STOP POLLING');
    }
  }
   ngOnDestroy(): void {
    console.log('COMPONENT DESTROYED'); 
    this.stopPolling();
    clearInterval(this.timer);
    this.orderId_VNPay = "";
  }

  ngOnInit(): void {
    // 
    this.paymentForm = this.fb.group({
      Email: [''],
      Visa_number: [''],
      Visa_valid_date: [''],
      Visa_cvv: [''],
      Username: [''],
      Nation_buyer: [''],
      Nation_zip_buyer: [''],
      Nation_state_buyer: [''],
      VAT_number_buyer: [''],
      Total_Price_Before_VAT: [''],
      Total_VAT: [''],
      Total_Price_After_VAT: [''],
      Selected_List: [''],
      Payment_Method: [''],
      Price_currency: [''],
      Bank_Supplier : ['']

    });
    // this.paymentForm.get('Payment_Method')?.valueChanges.subscribe(value => {
    //  console.log('Payment Method changed:', value);
    //   if(Number(value) == 3){
    //     this.isVNPay_Payment_Visible = true;
    //   }
    //   else {
    //     this.isVNPay_Payment_Visible = false;
    //   }
    //   console.log(value);
    // });
  }
  // Because Paypal must check in 2 decimal places, cannot use 3 decimal places
  round2(value : number) : number {
    return Math.round(value * 100) / 100;
  }
  Convert_Price_Currency_From_VND_to_USD(VND_price: number): number {
    return this.round2(VND_price * this.exchange_Rate_VND_to_USD);
  }
  Convert_Price_Currency_From_VND_to_EUR(VND_price: number): number { 
    return this.round2(VND_price * this.exchange_Rate_VND_to_EUR);
  }
  // Function to handle payment
  NextButtonHandling() {
      this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
      this.isDivButtonActive = new Array(this.PersonalShoppingBags.length).fill("");
      this.isDivImageActive = new Array(this.PersonalShoppingBags.length).fill("carousel-item");
      if(this.Current_Counter>=this.PersonalShoppingBags.length-1){
          this.Current_Counter = 0; // Return first position after reach maximum value
      } else {
          this.Current_Counter += 1;
      }
      this.isDivButtonActive[this.Current_Counter] = "active";
      this.isDivImageActive[this.Current_Counter] = "carousel-item active";
      this.isButtonBackgroundChecked[this.Current_Counter] = true;

  }

  PreviousButtonHandling() {
      this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
      this.isDivButtonActive = new Array(this.PersonalShoppingBags.length).fill("");
      this.isDivImageActive = new Array(this.PersonalShoppingBags.length).fill("carousel-item");
      if(this.Current_Counter<=0){
          this.Current_Counter = this.PersonalShoppingBags.length - 1; // Return first position after reach maximum value
      } else {
          this.Current_Counter -= 1;
      }
      this.isDivButtonActive[this.Current_Counter] = "active";
      this.isDivImageActive[this.Current_Counter] = "carousel-item active";
      this.isButtonBackgroundChecked[this.Current_Counter] = true;
  }

  ButtonImageHandling(i : number){
      this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
      this.isDivButtonActive = new Array(this.PersonalShoppingBags.length).fill("");
      this.isDivImageActive = new Array(this.PersonalShoppingBags.length).fill("carousel-item");
      this.Current_Counter = i;
      this.isDivButtonActive[i] = "active";
      this.isDivImageActive[i] = "carousel-item active";
      this.isButtonBackgroundChecked[i] = true;
      console.log("Button clicked with index:", i);
  }
  TabelCheckHandling(i: number) {
      this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
      this.isDivButtonActive = new Array(this.PersonalShoppingBags.length).fill("");
      this.isDivImageActive = new Array(this.PersonalShoppingBags.length).fill("carousel-item");
      this.Current_Counter = i;
      this.isDivButtonActive[i] = "active";
      this.isDivImageActive[i] = "carousel-item active";
      this.isButtonBackgroundChecked[i] = true;
      console.log("Table checked with index:", i);
  } 
/*
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
    Selected_List!:Array<object>;
*/

  GetInfoFromLocalStorage_to_ConfirmedBox() {
    const setInnerHTML = (id: string, value: string | null) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = value ?? '';
    };
    if (Number(localStorage.getItem('Payment_Method')) == 2) {
      // PayPal payment selected
      this.isPayPal_Payment_Visible = true; // To handle the visibility of PayPal payment section
      this.isCash_Payment_Visible = false;
      this.isVNPay_Payment_Visible = false;
      this.isMomo_Payment_Visible = false;
      this.isInternetBanking_Payment_Visible = false;
      console.log("SelectedFromPersonalShoppingBags",this.SelectedFromPersonalShoppingBags);
      for (let i = 0; i < this.SelectedFromPersonalShoppingBags.length; i++) {
        console.log("SelectedFromPersonalShoppingBags[i].price before convert",this.SelectedFromPersonalShoppingBags[i].price);
        console.log("Type of this.SelectedFromPersonalShoppingBags[i].price is ", typeof this.SelectedFromPersonalShoppingBags[i].price);
        console.log("(Number(this.SelectedFromPersonalShoppingBags[i].price)) before convert",(Number(this.SelectedFromPersonalShoppingBags[i].price)));
        console.log("Type of (Number(this.SelectedFromPersonalShoppingBags[i].price)) is ", typeof (Number(this.SelectedFromPersonalShoppingBags[i].price)));
        this.SelectedFromPersonalShoppingBags_In_USD[i] = {
          candle_name: this.SelectedFromPersonalShoppingBags[i].candle_name,
          quatity: this.SelectedFromPersonalShoppingBags[i].quatity,
          price: this.Convert_Price_Currency_From_VND_to_USD((Number(this.SelectedFromPersonalShoppingBags[i].price))*1000).toString(),
          image: this.SelectedFromPersonalShoppingBags[i].image
        };
        console.log("SelectedFromPersonalShoppingBags_In_USD",this.SelectedFromPersonalShoppingBags_In_USD); 
      }
      if(!this.isTrigger_Paypal_JS_SDK){
        this.Trigger_PayPal_Javascript_SDK();
      }
    } else if (Number(localStorage.getItem('Payment_Method')) == 3){
      // VNPAY payment selected
      this.isVNPay_Payment_Visible = true;
      this.isPayPal_Payment_Visible = false;
      this.isCash_Payment_Visible = false;
      this.isMomo_Payment_Visible = false;
      this.isInternetBanking_Payment_Visible = false;
      
      // do nothing
    } else if (Number(localStorage.getItem('Payment_Method')) == 4) {
      // Momo payment selected
      this.isMomo_Payment_Visible = true;
      this.isPayPal_Payment_Visible = false;
      this.isCash_Payment_Visible = false;
      this.isVNPay_Payment_Visible = false;
      this.isInternetBanking_Payment_Visible = false;
    }
    else if (Number(localStorage.getItem('Payment_Method')) == 5) {
      // Internet Banking payment selected
      this.isInternetBanking_Payment_Visible = true;
      this.isPayPal_Payment_Visible = false;
      this.isCash_Payment_Visible = false;
      this.isVNPay_Payment_Visible = false;
      this.isMomo_Payment_Visible = false;
    } else {
      // Cash on delivery selected
      this.isCash_Payment_Visible = true;
      this.isPayPal_Payment_Visible = false;
      this.isVNPay_Payment_Visible = false;
      this.isMomo_Payment_Visible = false;
      this.isInternetBanking_Payment_Visible = false;
    }
    setInnerHTML("username_of_buyer_confirmed", localStorage.getItem('cardholder_buyer'));
    setInnerHTML("email_of_buyer_confirmed", localStorage.getItem('email_of_buyer'));
    setInnerHTML("visa_number_confirmed", localStorage.getItem('visa_number'));
    setInnerHTML("visa_valid_date_confirmed", localStorage.getItem('visa_valid_date'));
    setInnerHTML("visa_cvv_confirmed", localStorage.getItem('visa_cvv'));
    setInnerHTML("nation_buyer_confirmed", localStorage.getItem('nation_buyer'));
    setInnerHTML("nation_zip_buyer_confirmed", localStorage.getItem('nation_zip_buyer'));
    setInnerHTML("nation_state_buyer_confirmed", localStorage.getItem('nation_state_buyer'));
    setInnerHTML("VAT_number_buyer_confirmed", localStorage.getItem('VAT_number_buyer'));
    setInnerHTML("price_currency_confirmed", localStorage.getItem('Price_currency') == '1' ? 'VND' : (localStorage.getItem('Price_currency') == '2' ? 'USD' : 'EUR'));
    setInnerHTML("exchange_Rate_confirmed", this.Price_currency_selected == 2 ? this.exchange_Rate_VND_to_USD.toString() : (this.Price_currency_selected == 3 ? this.exchange_Rate_VND_to_EUR.toString() : "1"));
    setInnerHTML("label_for_total_price_confirmed", this.Price_currency_selected == 1 ? `${this.total_price_before_VAT_confirmed/1000}.000 VND` : this.Price_currency_selected == 2 ? `${this.total_price_before_VAT_confirmed} USD` : `${this.total_price_before_VAT_confirmed} EUR`); // Convert to VND display
    setInnerHTML("label_for_total_VAT_price_confirmed", this.Price_currency_selected == 1 ? `${this.VAT_Price_confirmed/1000}.000 VND`: this.Price_currency_selected == 2 ? `${this.VAT_Price_confirmed} USD` : `${this.VAT_Price_confirmed} EUR`); // Convert to VND display
    setInnerHTML("label_for_total_payment_2_confirmed", this.Price_currency_selected == 1 ? `${this.total_price_after_VAT_confirmed/1000}.000 VND` : this.Price_currency_selected == 2 ? `${this.total_price_after_VAT_confirmed} USD` : `${this.total_price_after_VAT_confirmed} EUR`); // Convert to VND display
  }

  Request_Write_Into_RedisCache_and_Database(inputDataForConfirmation:HistoricalShoppingBag){
    console.log(`visa_number in RequrstWrite function is ${inputDataForConfirmation.Visa_number}`);
    var TransmitData2 = JSON.stringify( 
      { 
          Username: `${inputDataForConfirmation.Username}`,
          Email: `${inputDataForConfirmation.Email}`,
          Visa_number: `${inputDataForConfirmation.Visa_number}`,
          Visa_valid_date: `${inputDataForConfirmation.Visa_valid_date}`,
          Visa_cvv: `${inputDataForConfirmation.Visa_cvv}`,
          Nation_buyer: `${inputDataForConfirmation.Nation_buyer}`,
          Nation_zip_buyer: `${inputDataForConfirmation.Nation_zip_buyer}`,
          Nation_state_buyer: `${inputDataForConfirmation.Nation_state_buyer}`,
          VAT_number_buyer: `${inputDataForConfirmation.VAT_number_buyer}`,
          Total_Price_Before_VAT: `${inputDataForConfirmation.Total_Price_Before_VAT}`,
          Total_VAT: `${inputDataForConfirmation.Total_VAT}`,
          Total_Price_After_VAT: `${inputDataForConfirmation.Total_Price_After_VAT}`,
          Selected_List: `${inputDataForConfirmation.Selected_List}`,
      } 
    ); 
    var TransmitData = 
      { 
          Username: `${inputDataForConfirmation.Username}`,
          Email: `${inputDataForConfirmation.Email}`,
          Visa_number: `${inputDataForConfirmation.Visa_number}`,
          Visa_valid_date: `${inputDataForConfirmation.Visa_valid_date}`,
          Visa_cvv: `${inputDataForConfirmation.Visa_cvv}`,
          Nation_buyer: `${inputDataForConfirmation.Nation_buyer}`,
          Nation_zip_buyer: `${inputDataForConfirmation.Nation_zip_buyer}`,
          Nation_state_buyer: `${inputDataForConfirmation.Nation_state_buyer}`,
          VAT_number_buyer: `${inputDataForConfirmation.VAT_number_buyer}`,
          Total_Price_Before_VAT: `${inputDataForConfirmation.Total_Price_Before_VAT}`,
          Total_VAT: `${inputDataForConfirmation.Total_VAT}`,
          Total_Price_After_VAT: `${inputDataForConfirmation.Total_Price_After_VAT}`,
          Selected_List: `${inputDataForConfirmation.Selected_List}`,
      } ;
    console.log("Type of TransmitData2 is ", typeof(TransmitData2));
    console.log("TransmitData2 is ", TransmitData2);
    console.log("Type of TransmitData is ", typeof(TransmitData));
    console.log("TransmitData is ", TransmitData);

    this.paymentService.SetOrderCompleted_and_Confirmed_via_mail(
      inputDataForConfirmation
    ).subscribe((response) => {
      console.log("Response from server is ", response);
        if (response[0]?.status == "status_of_confirmed_order") {
          console.log("Order is completed");
          this.GLOBAL_label_for_total_price = inputDataForConfirmation.Total_Price_Before_VAT;
          this.GLOBAL_label_for_total_VAT_price = inputDataForConfirmation.Total_VAT;
          this.GLOBAL_label_for_total_payment = inputDataForConfirmation.Total_Price_After_VAT;
          this.Passed_Confirmation();
        } else {
          console.log("Order is not completed");
          this.Failed_Confirmation();
        }
      }, (error) => {
        console.error("Error occurred while writing into Redis cache and database:", error);
      }
    );
  }
  PaymentButtonTrigger(formValue: HistoricalShoppingBag) {
      console.log(formValue);
      this.Price_currency_selected = Number(formValue.Price_currency);
      this.Payment_Method_selected = Number(formValue.Payment_Method);
      if(this.Payment_Method_selected == 2) {
        // PayPal selected - Can use in USD or EUR
        if(this.Price_currency_selected == 1) {
            alert("PayPal payment method can only use in USD or EUR currency. Please change the currency.");
            return;
        }
      } else {
        // VNPAY or Momo or Cash on Delivery selected - Must use VND
        if(this.Price_currency_selected != 1) {
            alert("Selected payment method can only use in VND currency. Please change the currency.");
            return;
        }
      } 
      localStorage.setItem('Selected_List', `${this.SelectedFromPersonalShoppingBags_TO_SERVER}`); // tempt check
      this.isConfirmation_Box_Visible = true; 
      this.isConfirmation_Box_child_Visible = true; // To handle the visibility of the confirmation box child
      this.isMain_body_Visible = false; // To handle the visibility of the main body
      this.isMain_body_1_Visible = false; // To handle the visibility of the main body 1
      this.isMain_body_2_Visible = false; // To handle the visibility of the main body 2
      if(this.Price_currency_selected == 1) {
          // VND selected
          this.total_price_after_VAT_confirmed = this.round2(this.total_price_after_VAT);
          this.total_price_before_VAT_confirmed = this.round2(this.total_price_before_VAT);
          this.VAT_Price_confirmed = this.round2(this.VAT_Price);
      } else if (this.Price_currency_selected == 2) {
          // USD selected
          this.total_price_after_VAT_confirmed = this.Convert_Price_Currency_From_VND_to_USD(this.total_price_after_VAT);
          this.total_price_before_VAT_confirmed = this.Convert_Price_Currency_From_VND_to_USD(this.total_price_before_VAT);
          this.VAT_Price_confirmed = this.Convert_Price_Currency_From_VND_to_USD(this.VAT_Price);
      } else {
          // EUR selected
          this.total_price_after_VAT_confirmed = this.Convert_Price_Currency_From_VND_to_EUR(this.total_price_after_VAT);
          this.total_price_before_VAT_confirmed = this.Convert_Price_Currency_From_VND_to_EUR(this.total_price_before_VAT);
          this.VAT_Price_confirmed = this.Convert_Price_Currency_From_VND_to_EUR(this.VAT_Price);
      }
      localStorage.setItem('email_of_buyer', `${formValue.Email}`);
      localStorage.setItem('visa_number', `${formValue.Visa_number}`);
      localStorage.setItem('visa_valid_date', `${formValue.Visa_valid_date}`);
      localStorage.setItem('visa_cvv', `${formValue.Visa_cvv}`);
      localStorage.setItem('cardholder_buyer', `${formValue.Username}`);
      localStorage.setItem('nation_buyer', `${formValue.Nation_buyer}`);
      localStorage.setItem('nation_zip_buyer', `${formValue.Nation_zip_buyer}`);
      localStorage.setItem('nation_state_buyer', `${formValue.Nation_state_buyer}`);
      localStorage.setItem('VAT_number_buyer', `${formValue.VAT_number_buyer}`);
      localStorage.setItem('label_for_total_price', `${this.total_price_before_VAT/1000}.000 VND`);
      localStorage.setItem('label_for_total_VAT_price', `${this.VAT_Price/1000}.000 VND`);
      localStorage.setItem('label_for_total_payment', `${this.total_price_after_VAT/1000}.000 VND`);
      localStorage.setItem('Payment_Method', `${formValue.Payment_Method}`);
      localStorage.setItem('Price_currency', `${formValue.Price_currency}`);
      console.log("formValue.Payment_Method is ", `${formValue.Payment_Method}`);
      console.log("formValue.Price_currency is ", `${formValue.Price_currency}`);

      console.log("PersonalShoppingBagsis ", this.PersonalShoppingBags);
      console.log("SelectedFromPersonalShoppingBags_TO_SERVER is ", this.SelectedFromPersonalShoppingBags_TO_SERVER);
      this.GetInfoFromLocalStorage_to_ConfirmedBox(); 
      // this.loadButtons();

  }
  Failed_Confirmation() {
      this.isConfirmation_Box_Visible = false; 
      this.isConfirmation_Box_child_Visible = false; 
      this.isMain_body_Visible = true;
      this.isMain_body_1_Visible = true;
      this.isMain_body_2_Visible = true;
  }
  Trigger_PayPal_Payment() {
    console.log("Trigger_PayPal_Payment called");
    // Implement PayPal payment logic here
    this.paymentService.Create_PayPal_Order(this.AllListToServer2).subscribe((response) => {
      console.log("Response from server for PayPal order is ", response);
    });

  }

  // JavaScript SDK method to load PayPal buttons
  Trigger_PayPal_Javascript_SDK() {
    this.isTrigger_Paypal_JS_SDK = true;
    this.paymentService
      .loadPaypalScript('Af0dZWwp7kgYSc_Dd5Uo2evyrVE5zVTh7DPzW7RONsXm4ABoT_n3RGVXBMOFRdpHcDO6qBWZLqsDuHgp')
      .then(() => {
        // Button is on build-in PayPal JS SDK
        paypal.Buttons({

          // Stardard flow of PayPal payment: Create order -> Approve payment -> Capture order
          // Fỉrst step: Create order
          createOrder: async () => {
              const orderDetails = this.GetAllValidInformation_for_payment();
              const res : any = await firstValueFrom (this.paymentService.Create_PayPal_Order(orderDetails));
              console.log('Order created:', res);
              return res.id;  // Bắt buộc trả về id
            },
          
          // After order is created successfully, Login pop up of PayPal will appear for user to approve payment
          // Second step: Approve payment
          onApprove: async (data: any) => {
            this.orderID_from_PayPal = data.orderID;
            console.log("onApprove:", data);
            const details: any = await firstValueFrom(
              this.paymentService.Capture_PayPal_Order(data.orderID)
            );


            // Third step: Capture order
            if(details.payer.name.given_name != null || details.payer.name.given_name != undefined){ 
              // Payment is successful
              this.Passed_Confirmation();
              alert("Thanh toán thành công: " + details.payer.name.given_name);
            } else {
              alert("Thanh toán không thành công");
            }
            
          },
          onError: (err: any) => {
            console.error('PayPal Error: ', err);
          }
        }).render(this.paypalElement.nativeElement);
      });
  }
  GetAllValidInformation_for_payment() {
    // To get all valid information for payment from local storage
    var username_of_buyer_confirmed = localStorage.getItem('cardholder_buyer');
    var email_of_buyer_confirmed = localStorage.getItem('email_of_buyer');
    var visa_number_confirmed = localStorage.getItem('visa_number');
    var visa_valid_date_confirmed = localStorage.getItem('visa_valid_date');
    var visa_cvv_confirmed = localStorage.getItem('visa_cvv');
    var nation_buyer_confirmed = localStorage.getItem('nation_buyer');
    var nation_zip_buyer_confirmed = localStorage.getItem('nation_zip_buyer');
    var nation_state_buyer_confirmed = localStorage.getItem('nation_state_buyer');
    var VAT_number_buyer_confirmed = localStorage.getItem('VAT_number_buyer');
    if(this.Price_currency_selected == 1) {
        // VND selected
        var label_for_total_price_confirmed = this.total_price_before_VAT_confirmed/1000 + ".000 VND";
        var label_for_total_VAT_price_confirmed = this.VAT_Price_confirmed/1000 + ".000 VND";
        var label_for_total_payment_2_confirmed = this.total_price_after_VAT_confirmed/1000 + ".000 VND";

    } else if (this.Price_currency_selected == 2) {
        // USD selected
        var label_for_total_price_confirmed = this.total_price_before_VAT_in_USD + " USD";
        var label_for_total_VAT_price_confirmed = this.VAT_Price_in_USD + " USD";
        var label_for_total_payment_2_confirmed = this.total_price_after_VAT_in_USD + " USD";
    } else {
        // EUR selected
        var label_for_total_price_confirmed = this.total_price_before_VAT_confirmed + " EUR";
        var label_for_total_VAT_price_confirmed = this.VAT_Price_confirmed + " EUR";
        var label_for_total_payment_2_confirmed = this.total_price_after_VAT_confirmed + " EUR";
    }
      const AllListToServer: HistoricalShoppingBag = { 
      Username: username_of_buyer_confirmed ?? '',
      Email: email_of_buyer_confirmed ?? '',
      Visa_number: visa_number_confirmed ?? '',
      Visa_valid_date: visa_valid_date_confirmed ?? '',
      Visa_cvv: visa_cvv_confirmed ?? '',
      Nation_buyer: nation_buyer_confirmed ?? '',
      Nation_zip_buyer: nation_zip_buyer_confirmed ?? '',
      Nation_state_buyer: nation_state_buyer_confirmed ?? '',
      VAT_number_buyer: VAT_number_buyer_confirmed ?? '',
      Total_Price_Before_VAT: label_for_total_price_confirmed ?? '',
      Total_VAT: label_for_total_VAT_price_confirmed ?? '',
      Total_Price_After_VAT: label_for_total_payment_2_confirmed ?? '',
      Selected_List: this.SelectedFromPersonalShoppingBags_TO_SERVER ?? '',
      Selected_List_Object: this.SelectedFromPersonalShoppingBags_In_USD ?? '',
      Price_currency: this.Price_currency_selected.toString(),
      language_for_VNPay: 'en',
      amount_for_VNPay: this.total_price_after_VAT_confirmed.toString(),
      bankCode_for_VNPay: this.bankCode_for_VNPay ?? ''

    };
    return AllListToServer;
  }

  Passed_Confirmation() {
    this.AllListToServer2  = this.GetAllValidInformation_for_payment();
    if(this.isPayPal_Payment_Visible){
      this.AllListToServer2.Payment_gateway_id = this.orderID_from_PayPal;
      this.AllListToServer2.Method_by_Order = "paypal";
    }
    else if (this.isVNPay_Payment_Visible){
      this.AllListToServer2.Payment_gateway_id = this.orderId_VNPay;
      this.AllListToServer2.Method_by_Order = "vnpay";
    }
    else if (this.isMomo_Payment_Visible){
      this.AllListToServer2.Payment_gateway_id = this.orderId_Momo;
      this.AllListToServer2.Method_by_Order = "momo";
    }
    else {
      this.AllListToServer2.Payment_gateway_id = "Undefine by Cash";
      this.AllListToServer2.Method_by_Order = "cash";
    }
    localStorage.clear();

    // var TransmitData3 = 
    // { 
    //     Username: "hello",
    //     Email: "nguyentrungtin1002@gmail.com",
    //     Visa_number: "hello",
    //     Visa_valid_date: "hello",
    //     Visa_cvv: "hello",
    //     Nation_buyer: "hello",
    //     Nation_zip_buyer: "hello",
    //     Nation_state_buyer: "hello",
    //     VAT_number_buyer: "hello",
    //     Total_Price_Before_VAT: "hello",
    //     Total_VAT: "hello",
    //     Total_Price_After_VAT: "hello",
    //     Selected_List: this.SelectedFromPersonalShoppingBags_TO_SERVER,
    // } ;
    
  // this.AllListToServer2 = AllListToServer; // Assign local variable to global variable

  //   console.log("Type of AllListToServer is ", typeof(AllListToServer));
  //   console.log("Value of AllListToServer is ", AllListToServer);
  //   console.log("Type of AllListToServer.Selected_List is ", typeof(AllListToServer.Selected_List));
  //   console.log("Value of AllListToServer.Selected_List is ", AllListToServer.Selected_List);
  //   // this.Request_Write_Into_RedisCache_and_Database(AllListToServer);
    
    this.paymentService.SetOrderCompleted_and_Confirmed_via_mail(
      this.AllListToServer2
    ).subscribe((response) => {
      console.log("Response from server is ", response);
        if (response[0]?.status == "status_of_confirmed_order") {
          console.log("Order is completed");
          // this.GLOBAL_label_for_total_price = inputDataForConfirmation.Total_Price_Before_VAT;
          // this.GLOBAL_label_for_total_VAT_price = inputDataForConfirmation.Total_VAT;
          // this.GLOBAL_label_for_total_payment = inputDataForConfirmation.Total_Price_After_VAT;
          // this.Passed_Confirmation();
          this.router.navigate(['']);
        } else {
          console.log("Order is not completed");
          this.router.navigate(['/payment_handling']);  // Navigate to login handling page internal in Angular
          // this.Failed_Confirmation();
        }
      }, (error) => {
        console.error("Error occurred while writing into Redis cache and database:", error);
      }
    );
  }
  Passed_Confirmation_of_VNPay() {
    console.log("Passed_Confirmation_of_VNPay called");
    this.AllListToServer2  = this.GetAllValidInformation_for_payment();
    if(this.isPayPal_Payment_Visible){
      this.AllListToServer2.Payment_gateway_id = this.orderID_from_PayPal;
    }
    // localStorage.clear();
    this.paymentService.VNPay_Create_Order_to_Backend(this.AllListToServer2).subscribe((response) => {
      console.log("Response from server is ", response);
      console.log("Response from server is ", response.vnpUrl);
      const VNpay_Url = response.vnpUrl;
      const VNPay_OrderId = response.orderId;
      this.orderId_VNPay = VNPay_OrderId;
      console.log("Response from server VNpay_Url is ", VNpay_Url);
      console.log("Response from server VNPay_OrderId is ", VNPay_OrderId);
      // window.location.href = response.vnpUrl;
      window.open(VNpay_Url, '_blank'); // 👈 mở tab mới
      }, (error) => {
        console.error("Error occurred while writing into Redis cache and database:", error);
      });
      this.startPolling_Check_Order_status_VNPay();
  }

  isProductChecked(i: number, event: Event) {
    // Name of first item is (this.PersonalShoppingBags[0].split(","))[0]
    // Quantity of first item is (this.PersonalShoppingBags[0].split(","))[1]
    // Price of first item is (this.PersonalShoppingBags[0].split(","))[2]
  const checked = (event.target as HTMLInputElement).checked;
  
  // this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
  if (checked) {
    // Checkbox is checked

    this.total_price_before_VAT = this.total_price_before_VAT + 1000*(Number(this.PersonalShoppingBags[i].split(",")[2])*Number(this.PersonalShoppingBags[i].split(",")[1]));
    this.VAT_Price = this.total_price_before_VAT * 0.2; // Assuming VAT is 20%
    this.total_price_after_VAT = this.total_price_before_VAT + this.VAT_Price;

    this.total_price_before_VAT_in_USD = this.total_price_before_VAT_in_USD + (this.Convert_Price_Currency_From_VND_to_USD(Number(this.PersonalShoppingBags[i].split(",")[2])*1000*Number(this.PersonalShoppingBags[i].split(",")[1])));
    this.VAT_Price_in_USD = this.round2(this.total_price_before_VAT_in_USD * 0.2); // Assuming VAT is 20%
    this.total_price_after_VAT_in_USD = this.round2(this.total_price_before_VAT_in_USD + this.VAT_Price_in_USD);

    this.SelectedFromPersonalShoppingBags_TO_SERVER.push(this.PersonalShoppingBags[i]);

    // this.counter_for_selected_items++;
    this.SelectedFromPersonalShoppingBags.push({
      candle_name: this.PersonalShoppingBags[i].split(",")[0],
      quatity: Number(this.PersonalShoppingBags[i].split(",")[1]),
      price: this.PersonalShoppingBags[i].split(",")[2],
      image: this.PersonalShoppingBags[i].split(",")[3]
    });

    console.log("Total price before VAT is ", this.total_price_before_VAT);
    console.log("VAT price is ", this.VAT_Price); 
    console.log("Total price after VAT is ", this.total_price_after_VAT);
    console.log("SelectedFromPersonalShoppingBags is ", this.SelectedFromPersonalShoppingBags_TO_SERVER);
    
  } else {
    // this.counter_for_selected_items--;
    // this.SelectedFromPersonalShoppingBags_TO_SERVER[this.counter_for_selected_items] = ""; // Remove item from selected list
    
    // Checkbox is unchecked
    this.total_price_before_VAT = this.total_price_before_VAT - 1000* (Number(this.PersonalShoppingBags[i].split(",")[2])*Number(this.PersonalShoppingBags[i].split(",")[1]));
    this.VAT_Price = this.total_price_before_VAT * 0.2; // Assuming VAT is 20%
    this.total_price_after_VAT = this.total_price_before_VAT + this.VAT_Price;

    this.total_price_before_VAT_in_USD = this.total_price_before_VAT_in_USD - (this.Convert_Price_Currency_From_VND_to_USD(Number(this.PersonalShoppingBags[i].split(",")[2])*1000*Number(this.PersonalShoppingBags[i].split(",")[1])));
    this.VAT_Price_in_USD = this.round2(this.total_price_before_VAT_in_USD * 0.2);
    this.total_price_after_VAT_in_USD = this.round2(this.total_price_before_VAT_in_USD + this.VAT_Price_in_USD);

    // this.SelectedFromPersonalShoppingBags.length == this.PersonalShoppingBags[i].length
    //   ? this.SelectedFromPersonalShoppingBags = ""
    //   : this.SelectedFromPersonalShoppingBags = this.SelectedFromPersonalShoppingBags.replace("," + this.PersonalShoppingBags[i], "");
    this.SelectedFromPersonalShoppingBags = this.SelectedFromPersonalShoppingBags.filter(item => item.candle_name !== this.PersonalShoppingBags[i].split(",")[0]); 
    console.log("SelectedFromPersonalShoppingBags lenght is ", this.SelectedFromPersonalShoppingBags.length);
    // this.SelectedFromPersonalShoppingBags = this.SelectedFromPersonalShoppingBags.replace("," + this.PersonalShoppingBags[i], ""); // Remove item from selected list
    console.log("Total price before VAT is ", this.total_price_before_VAT);
    console.log("VAT price is ", this.VAT_Price); 
    console.log("Total price after VAT is ", this.total_price_after_VAT);
    console.log("SelectedFromPersonalShoppingBags is ", this.SelectedFromPersonalShoppingBags);
    // Remove item from selected list or update state
  }
  
  }

}
