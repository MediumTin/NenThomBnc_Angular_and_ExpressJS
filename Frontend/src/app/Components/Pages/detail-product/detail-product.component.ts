import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { Candles } from '../../../Common_Configuration/Models/Candles';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-product',
  imports: [FormsModule ],
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
  candles: Candles[] = [];
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
            this.cdr.detectChanges();
          } else {
            this.price = '';
            this.name = '';
            this.image = '';
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
}
