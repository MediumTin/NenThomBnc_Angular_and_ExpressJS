import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { Candles } from '../../../Common_Configuration/Models/Candles';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Selected_Candle } from '../../../Common_Configuration/Models/Selected_candles';

@Component({
  selector: 'app-detail-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit, AfterViewInit{


  // @ViewChild('candleImg') candleImg!: ElementRef<HTMLImageElement>;
  // @ViewChild('candleName') candleName!: ElementRef<HTMLElement>;
  // @ViewChild('candlePrice') candlePrice!: ElementRef<HTMLElement>;
  quantity : number = 1; // Default quantity
  price : string = "";
  name : string = "";
  image : string = "";
  available_quantity : number = 0;
  available_status : string = "";
  candles: Candles[] = [];
  AllowedFadeOut: boolean = true; 
  ReturnValueAfterPostMethod: Selected_Candle = new Selected_Candle; // This is the return value after post method
  isCheckShoppingBagVisible : boolean = false; // Default visibility of the shopping bag check
// isCheckShoppingBagVisible: any;
  constructor(
    private router:Router, 
    private candlesService : CandlesServiceService,
    activatedRoute: ActivatedRoute, 
    private renderer:Renderer2,
    private identification: IndentificationService,
    private cdr: ChangeDetectorRef
  ) {
    
    let candlesObervalbe: Observable<Candles[]>;
    console.log("User has identified yet");
    
    activatedRoute.params.subscribe((params) => {
      if (params['detail_product']){
        candlesObervalbe = this.candlesService.getCandlesByID_for_DetailInfo(params['detail_product']);
      }
      else {
        candlesObervalbe = this.candlesService.getAllCandles();
      } 
      candlesObervalbe.subscribe((serverCandles) => {
          this.candles = serverCandles; // Assign the final data to the component property
          console.log("Type is ",this.candles);
          if (this.candles.length > 0) {
            this.price = this.candles[0].price;
            this.name = this.candles[0].name;
            this.image = this.candles[0].image;
            this.available_quantity = Number(this.candles[0].available_quantity ?? 0);
            if(this.available_quantity > 0){
              this.available_status = `Available ${this.available_quantity} items`;
            } else {
              this.available_status = "Out of Stock";
            }
            this.cdr.detectChanges();
          } else {
            this.price = '';
            this.name = '';
            this.image = '';
            this.available_quantity = 0;
            this.available_status = "Out of Stock";
          }
          // this.candles = serverCandles; 
          
          console.log("Response from serve",this.candles);
          console.log("Response from serve for name",this.candles[0].image);
          // this.setInnerHTMLValue("Candle_Price", serverCandles[0].price);
          // this.setInnerHTMLValue("Candle_Name", serverCandles[0].name);
          // this.setImageSrcValue("Candle_Image", serverCandles[0].image);
          

      });
    });
  };
  ngAfterViewInit(): void {
    // --> Should not be used via ViewChild, as it is not reactive and will not update on changes.
    // if (this.candleImg) {
    //   this.candleImg.nativeElement.src = this.image;
    // }
    // if (this.candleName) {
    //   this.candleName.nativeElement.textContent = this.name;
    // }
    // if (this.candlePrice) {
    //   this.candlePrice.nativeElement.textContent = this.price;
    // }
    }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');  
  }
  setInnerHTMLValue(id: string, text_value: string): void {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) {
      el.innerHTML = text_value;
    }
  }

  setImageSrcValue(id: string, source_image: string): void {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) {
      el.src = source_image;
    }
  }
  setAttributeValue(id: string, attr: string, value: string): void {
    const el = document.getElementById(id);
    if (el) {
      this.renderer.setAttribute(el, attr, value);
    }
  }

  // quantity: number = 1;

  onQuantityChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.quantity = Number(value);
    // Nếu muốn xử lý thêm logic khi số lượng thay đổi, viết ở đây
  }
  addToBag() {
    console.log('clicked');
    this.isCheckShoppingBagVisible = true; // Show the shopping bag check
    this.AddedBoxFadeOut(this.AllowedFadeOut);
    // Scenario 1: If want user can access the website without login - will store in local storage (can store by any window and never clear until user clear it)
    this.candlesService.setCandleInformationToLocalStorageOfBrownser({
      quatity: this.quantity,
      candle_name: this.name,
      image: this.image,
      price: this.price
    });

    // Scenario 2: If want user must login before access the website - if user already loggin, will store in session storage  in server side
    // this.candlesService.setCandleInformationToSession({
    //   quatity: this.quantity,
    //   candle_name: this.name,
    //   image: this.image,
    //   price: this.price
    // }).subscribe({
    //   next: (response) => {
    //     console.log("Response from server when add to bag", response);
    //   }
    //   , error: (error) => {
    //     console.error("Error when adding to bag", error);
    //   }
    // });
    
  }
  BuyNowandMoveToShoppingBag() {
    // Scenario 1: If want user can access the website without login - will store in local storage (can store by any window and never clear until user clear it)
    this.candlesService.setCandleInformationToLocalStorageOfBrownser({
      quatity: this.quantity,
      candle_name: this.name,
      image: this.image,
      price: this.price
    });
    this.router.navigate(['/payment_handling']);  // Navigate to login handling page internal in Angular

    // Scenario 2: If want user must login before access the website - if user already loggin, will store in session storage  in server side
    // this.candlesService.setCandleInformationToSession({
    //   quatity: this.quantity,
    //   candle_name: this.name,
    //   image: this.image,
    //   price: this.price
    // }).subscribe((response_From_Serve) => {
    //     this.ReturnValueAfterPostMethod = Array.isArray(response_From_Serve) ? response_From_Serve[0] : response_From_Serve;
    //     console.log("Response from serve", this.ReturnValueAfterPostMethod);
    //     console.log("Candle name:", this.ReturnValueAfterPostMethod.status);
    //     if (this.ReturnValueAfterPostMethod.status === "Write session data into Redis sucessfully") {
    //       this.router.navigate(['/payment_handling']);  // Navigate to login handling page internal in Angular
    //     }

    //   });
  }

    checkShoppingBag() {
      this.router.navigate(['/Shopping_Bag_handling']); // Navigate to login handling page internal in Angular
    }
    AddedBoxFadeOut = (AllowedFadeOut: boolean)=> {
      if(AllowedFadeOut){
          setTimeout(
              () =>{
                  this.isCheckShoppingBagVisible = false;
              }
              ,
              3000
          );
          
      } else {
          this.isCheckShoppingBagVisible = true;
      }
    }
}
