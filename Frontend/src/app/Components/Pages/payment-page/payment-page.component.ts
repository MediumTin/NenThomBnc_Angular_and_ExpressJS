import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { PaymentService } from '../../../Services/payment/payment.service';
import { HistoricalShoppingBag } from '../../../Common_Configuration/Models/Historical_shopping_bag';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { type } from 'node:os';
import { Selected_Candle } from '../../../Common_Configuration/Models/Selected_candles';
import { empty } from 'rxjs';

@Component({
  selector: 'app-payment-page',
  // imports: [TitleComponent, OrderItemsListComponent, PaypalButtonComponent, CommonModule, MapComponent],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit, AfterViewInit {
  counter_to_server : number = 0;
  paymentForm!: FormGroup; // Use definite assignment
  // historicalBag: HistoricalShoppingBag = new HistoricalShoppingBag();
  Current_Counter : number = 0;
  PersonalShoppingBags : string = "";
  SelectedFromPersonalShoppingBags: Array<Selected_Candle> = []; // To store selected items from personal shopping bags
  SelectedFromPersonalShoppingBags_TO_SERVER :string[] = []; // type is 
  counter_for_selected_items: number = 0; // To count the number of selected items
  account: string = "";
  isDivButtonActive: string[] = [];
  isDivImageActive: string[] = [];
  isButtonBackgroundChecked: boolean[] = []; // To handle the background color of the button
  isConfirmation_Box_Visible: boolean = false; // To handle the visibility of the confirmation box
  isConfirmation_Box_child_Visible: boolean = false; // To handle the visibility of the confirmation box child
  isMain_body_Visible: boolean = true; // To handle the visibility of the main body
  isMain_body_1_Visible: boolean = true; // To handle the visibility of the main body 1
  isMain_body_2_Visible: boolean = true; // To handle the visibility of the main body 2
  GLOBAL_label_for_total_price : string = "0.00"; // Default value for total price before VAT
  GLOBAL_label_for_total_VAT_price : string = "0.00"; // Default value for total VAT price
  GLOBAL_label_for_total_payment : string = "0.00"; // Default value for total payment after VAT
  Current_Username: string = ""; // To store the current username
  total_price_before_VAT: number = 0;
  VAT_Price: number = 0;
  total_price_after_VAT: number = 0;
total_price_before_VAT_confirmed: any;
VAT_Price_confirmed: any;
total_price_after_VAT_confirmed: any;

  constructor(
    private fb: FormBuilder, 
    private router:Router, 
    private identification: 
    IndentificationService, 
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
      this.paymentService.GetShoppingBagOfCurrentUser().subscribe((userInfo) => {
        console.log("UserInfo is ", userInfo);  
        if (userInfo[0]?.status == "Session is timeout") {
          console.log("Session is timeout");
          this.identification.ClearSessionStorage();
          this.identification.SetisUserIdentifiedMain(false);
          this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
        } else {
          // status is "Session is normal"
          // this.sessionStorage = userInfo[0]?.personal_shopping_bag ?? ""; // data in string
          this.PersonalShoppingBags = JSON.parse(userInfo[0]?.personal_shopping_bag ?? ""); // data in object
          this.account = userInfo[0]?.Currentuser ?? "";
          console.log("type of personal_shopping_bag ", typeof this.PersonalShoppingBags);
          console.log("Personal shopping bag is ",this.PersonalShoppingBags);
          console.log("this.PersonalShoppingBags[0] is ", (this.PersonalShoppingBags[0].split(","))[3]);
          // Name of first item is (this.PersonalShoppingBags[0].split(","))[0]
          // Quantity of first item is (this.PersonalShoppingBags[0].split(","))[1]
          // Price of first item is (this.PersonalShoppingBags[0].split(","))[2]
          // Image of first item is (this.PersonalShoppingBags[0].split(","))[3]

          // Name of second item is (this.PersonalShoppingBags[1].split(","))[0]
          // Quantity of second item is (this.PersonalShoppingBags[1].split(","))[1]
          // Price of second item is (this.PersonalShoppingBags[1].split(","))[2]
          // Image of second item is (this.PersonalShoppingBags[1].split(","))[3]
          // this.Passed_Confirmation();
            //   this.candlesService.setCandleInformationToSession({
            //   quatity: 10,
            //   candle_name: "Hello",
            //   image: "Hello",
            //   price: "Hello"
            // }).subscribe({
            //   next: (response) => {
            //     console.log("Response from server when add to bag", response);
            //     // Navigate to the bag page or show a success message
            //     // this.router.navigate(['/bag']); // Navigate to login handling page internal in Angular
            //   }
            //   , error: (error) => {
            //     console.error("Error when adding to bag", error);
            //     // Handle the error, e.g., show an error message
            //   }
            // });

        }
        });
    } else {
      // User is not identified, handle accordingly - request login
      console.log("User has not identified yet in app component");
      this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      
    }
   }
  ngAfterViewInit(): void {
    this.Current_Counter = 0;
    this.isDivButtonActive[0] = "active";
    this.isDivImageActive[0] = "carousel-item active";
    this.isButtonBackgroundChecked[0] = true;
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
    });
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

    setInnerHTML("username_of_buyer_confirmed", localStorage.getItem('cardholder_buyer'));
    setInnerHTML("email_of_buyer_confirmed", localStorage.getItem('email_of_buyer'));
    setInnerHTML("visa_number_confirmed", localStorage.getItem('visa_number'));
    setInnerHTML("visa_valid_date_confirmed", localStorage.getItem('visa_valid_date'));
    setInnerHTML("visa_cvv_confirmed", localStorage.getItem('visa_cvv'));
    setInnerHTML("nation_buyer_confirmed", localStorage.getItem('nation_buyer'));
    setInnerHTML("nation_zip_buyer_confirmed", localStorage.getItem('nation_zip_buyer'));
    setInnerHTML("nation_state_buyer_confirmed", localStorage.getItem('nation_state_buyer'));
    setInnerHTML("VAT_number_buyer_confirmed", localStorage.getItem('VAT_number_buyer'));
    setInnerHTML("label_for_total_price_confirmed", this.GLOBAL_label_for_total_price + "VND");
    setInnerHTML("label_for_total_VAT_price_confirmed", this.GLOBAL_label_for_total_VAT_price + "VND");
    setInnerHTML("label_for_total_payment_2_confirmed", this.GLOBAL_label_for_total_payment + "VND");
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
      localStorage.setItem('email_of_buyer', `${formValue.Email}`);
      localStorage.setItem('visa_number', `${formValue.Visa_number}`);
      localStorage.setItem('visa_valid_date', `${formValue.Visa_valid_date}`);
      localStorage.setItem('visa_cvv', `${formValue.Visa_cvv}`);
      localStorage.setItem('cardholder_buyer', `${formValue.Username}`);
      localStorage.setItem('nation_buyer', `${formValue.Nation_buyer}`);
      localStorage.setItem('nation_zip_buyer', `${formValue.Nation_zip_buyer}`);
      localStorage.setItem('nation_state_buyer', `${formValue.Nation_state_buyer}`);
      localStorage.setItem('VAT_number_buyer', `${formValue.VAT_number_buyer}`);
      localStorage.setItem('label_for_total_price', `${formValue.Total_Price_Before_VAT}`);
      localStorage.setItem('label_for_total_VAT_price', `${formValue.Total_VAT}`);
      localStorage.setItem('label_for_total_payment', `${formValue.Total_Price_After_VAT}`);
      // this.SelectedFromPersonalShoppingBags = this.PersonalShoppingBags; // data in object
      // localStorage.setItem('Selected_List', `${formValue.Selected_List}`);
      localStorage.setItem('Selected_List', `${this.SelectedFromPersonalShoppingBags_TO_SERVER}`); // tempt check
      this.isConfirmation_Box_Visible = true; 
      this.isConfirmation_Box_child_Visible = true; // To handle the visibility of the confirmation box child
      this.isMain_body_Visible = false; // To handle the visibility of the main body
      this.isMain_body_1_Visible = false; // To handle the visibility of the main body 1
      this.isMain_body_2_Visible = false; // To handle the visibility of the main body 2
      this.total_price_after_VAT_confirmed = this.total_price_after_VAT;
      this.total_price_before_VAT_confirmed = this.total_price_before_VAT;
      this.VAT_Price_confirmed = this.VAT_Price;
      console.log("PersonalShoppingBagsis ", this.PersonalShoppingBags);
      console.log("SelectedFromPersonalShoppingBags_TO_SERVER is ", this.SelectedFromPersonalShoppingBags_TO_SERVER);
      
      // this.PersonalShoppingBags = JSON.parse(userInfo[0]?.personal_shopping_bag ?? ""); // data in object
      this.GetInfoFromLocalStorage_to_ConfirmedBox(); 

  }
  Failed_Confirmation() {
      this.isConfirmation_Box_Visible = false; 
      this.isConfirmation_Box_child_Visible = false; 
      this.isMain_body_Visible = true;
      this.isMain_body_1_Visible = true;
      this.isMain_body_2_Visible = true;
  }
  Passed_Confirmation() {
    var username_of_buyer_confirmed = localStorage.getItem('cardholder_buyer');
    var email_of_buyer_confirmed = localStorage.getItem('email_of_buyer');
    var visa_number_confirmed = localStorage.getItem('visa_number');
    var visa_valid_date_confirmed = localStorage.getItem('visa_valid_date');
    var visa_cvv_confirmed = localStorage.getItem('visa_cvv');
    var nation_buyer_confirmed = localStorage.getItem('nation_buyer');
    var nation_zip_buyer_confirmed = localStorage.getItem('nation_zip_buyer');
    var nation_state_buyer_confirmed = localStorage.getItem('nation_state_buyer');
    var VAT_number_buyer_confirmed = localStorage.getItem('VAT_number_buyer');
    var label_for_total_price_confirmed = this.total_price_before_VAT + ".000 VND";
    var label_for_total_VAT_price_confirmed = this.VAT_Price + ".000 VND";
    var label_for_total_payment_2_confirmed = this.total_price_after_VAT + ".000 VND";

    // var SelectedListNew = this.PersonalShoppingBags; // tempt check
    console.log(`Visa number in html is ${visa_number_confirmed}`);
    localStorage.clear();
    // var AllListToServer = 
    // { 
    //     Username: username_of_buyer_confirmed,
    //     Email: email_of_buyer_confirmed,
    //     Visa_number: visa_number_confirmed,
    //     Visa_valid_date: visa_valid_date_confirmed,
    //     Visa_cvv: visa_cvv_confirmed,
    //     Nation_buyer: nation_buyer_confirmed,
    //     Nation_zip_buyer: nation_zip_buyer_confirmed,
    //     Nation_state_buyer: nation_state_buyer_confirmed,
    //     VAT_number_buyer: VAT_number_buyer_confirmed,
    //     Total_Price_Before_VAT: label_for_total_price_confirmed,
    //     Total_VAT: label_for_total_VAT_price_confirmed,
    //     Total_Price_After_VAT: label_for_total_payment_2_confirmed,
    //     Selected_List: this.PersonalShoppingBags,
    // } ;
    var TransmitData3 = 
    { 
        Username: "hello",
        Email: "nguyentrungtin1002@gmail.com",
        Visa_number: "hello",
        Visa_valid_date: "hello",
        Visa_cvv: "hello",
        Nation_buyer: "hello",
        Nation_zip_buyer: "hello",
        Nation_state_buyer: "hello",
        VAT_number_buyer: "hello",
        Total_Price_Before_VAT: "hello",
        Total_VAT: "hello",
        Total_Price_After_VAT: "hello",
        Selected_List: this.SelectedFromPersonalShoppingBags_TO_SERVER,
    } ;
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
    Selected_List: this.SelectedFromPersonalShoppingBags_TO_SERVER ?? '' 

};

    console.log("Type of AllListToServer is ", typeof(AllListToServer));
    console.log("Value of AllListToServer is ", AllListToServer);
    console.log("Type of AllListToServer.Selected_List is ", typeof(AllListToServer.Selected_List));
    console.log("Value of AllListToServer.Selected_List is ", AllListToServer.Selected_List);
    // this.Request_Write_Into_RedisCache_and_Database(AllListToServer);
    this.paymentService.SetOrderCompleted_and_Confirmed_via_mail(
      AllListToServer
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

  isProductChecked(i: number, event: Event) {
    // Name of first item is (this.PersonalShoppingBags[0].split(","))[0]
    // Quantity of first item is (this.PersonalShoppingBags[0].split(","))[1]
    // Price of first item is (this.PersonalShoppingBags[0].split(","))[2]
  const checked = (event.target as HTMLInputElement).checked;
  
  // this.isButtonBackgroundChecked = new Array(this.PersonalShoppingBags.length).fill(false);
  if (checked) {
    // Checkbox is checked
    // Add item to selected list or update state
    this.total_price_before_VAT = this.total_price_before_VAT + Number(this.PersonalShoppingBags[i].split(",")[2])*Number(this.PersonalShoppingBags[i].split(",")[1]);
    this.VAT_Price = this.total_price_before_VAT * 0.2; // Assuming VAT is 20%
    this.total_price_after_VAT = this.total_price_before_VAT + this.VAT_Price;
    // this.SelectedFromPersonalShoppingBags_TO_SERVER.length != 0 
    //   ? this.SelectedFromPersonalShoppingBags_TO_SERVER = this.SelectedFromPersonalShoppingBags_TO_SERVER + "," + this.PersonalShoppingBags[i]
    //   : this.SelectedFromPersonalShoppingBags_TO_SERVER[] = this.PersonalShoppingBags[i]; // Add item to selected list
    
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
    this.total_price_before_VAT = this.total_price_before_VAT - Number(this.PersonalShoppingBags[i].split(",")[2])*Number(this.PersonalShoppingBags[i].split(",")[1]);
    this.VAT_Price = this.total_price_before_VAT * 0.2; // Assuming VAT is 20%
    this.total_price_after_VAT = this.total_price_before_VAT + this.VAT_Price;
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
