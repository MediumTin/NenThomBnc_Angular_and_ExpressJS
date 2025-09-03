import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { FilteredProductService } from '../../Services/FilteredService/filtered-product.service';
import { CandlesServiceService } from '../../Services/CandlesService/candles-service.service';
import { IndentificationService } from '../../Services/IdentificationService/indentification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-common-product',
  // standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule, CommonModule, RouterModule,FilterBarComponent],
  templateUrl: './common-product.component.html',
  styleUrl: './common-product.component.css'
})
export class CommonProductComponent implements OnInit, AfterViewInit{
  
  // CheckBoxValueArrayParentComponent : boolean= true;
  CheckBoxValueArrayParentComponent: boolean[][] = [
    [false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false]
  ]; // default value

    candle_CB : boolean = false;
    oil_CB : boolean = false;
    accessory_CB : boolean = false;
    gift_CB : boolean = false;
    best_saler_CB : boolean = false;
    discount_CB : boolean = false;
    new_arrival_CB : boolean = false;
    sweet_fruit_CB : boolean = false;
    wood_men_CB : boolean = false;
    fresh_relax_CB : boolean = false;
    flower_herb_CB : boolean = false;
    lumos_CB : boolean = false;
    citta_CB : boolean = false;
    no_brand_CB : boolean = false;
    smaller_100KVND_CB : boolean = false;
    HundredKVND_to_200KVND_CB : boolean = false;
    TwoHundredKVND_to_300KVND_CB : boolean = false;
    ThreeHundredKVND_to_500KVND_CB : boolean = false;
    larger_500KVND_CB : boolean = false;
    black_CB : boolean = false;
    white_CB : boolean = false;
    red_CB : boolean = false;
    pink_CB : boolean = false;
    blue_CB : boolean = false;
    green_CB : boolean = false;
    yellow_CB : boolean = false;
    orange_CB : boolean = false;
    purple_CB : boolean = false;
     // default value
  // CheckBoxValueArrayParentComponent : any = {};
  currentRoute: string = '';
  candles: Candles[] = [];
  isUserIdentified : UserInformation[] =[];
  @ViewChild('tableMenu', { static: false }) tableMenu!: ElementRef<HTMLTableElement>;
  // @ViewChild('pTag', { static: false }) pTag!: ElementRef<HTMLTableElement>;

  constructor(private cdr: ChangeDetectorRef, private filteredProduct : FilteredProductService, private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService )
  { 
    this.currentRoute = this.router.url.split('/')[1];
    console.log("Current route in common product component:", this.currentRoute);
      var data_request_filter = 
      {   name: "Request_Filter_Product", 
          Request_Of_Type: (this.currentRoute == "diffuse_oils" || this.currentRoute == "natural_oils" || this.currentRoute == "burn_candles"  || this.currentRoute == "care_candles")?"candle,oil,accessory,gift":`${this.currentRoute}`, 
          Request_Of_Group: "best_seller,discount,new_arrival,sweet_fruit,wood_men,fresh_relax,flower_herb", 
          Request_Of_Brand: "lumos,citta,no_brand", 
          Request_Of_Price: "smaller_100KVND,100KVND_to_200KVND,200KVND_to_300KVND,300KVND_to_500KVND,larger_500KVND", 
          Request_Of_Color: "black,white,red,pink,blue,green,yellow,orange,purple" 
      } ; 
      let candlesObervalbe: Observable<Candles[]>;
      candlesObervalbe = this.candlesService.getAllCandlesByFilter(data_request_filter);
      candlesObervalbe.subscribe((serverCandles) => {
      this.candles = serverCandles; // Assign the final data to the component property
      console.log("Response from serve",this.candles);

      // Scenario 2: If want user must login before access the website
      // if(this.candles[0].status == "Session is timeout"){
      //   console.log("Session is timeout");
      //   this.identification.ClearSessionStorage();
      //   this.identification.SetisUserIdentifiedMain(false);
      //   this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
      // }  
      // else {
      //   // status is "Session is normal"
      // }
    });

  };

  ngAfterViewInit(): void {
    // this.filterbar.setCheckboxValue('accessory', true);
    if(this.currentRoute === 'candle'){
      this.candle_CB = true;
    }
    else if(this.currentRoute === 'oil'){
      this.oil_CB = true;
    }
    else if(this.currentRoute === 'accessory'){
      this.accessory_CB = true;
    }
    else if(this.currentRoute === 'gift'){
      this.gift_CB = true;
    }
    else {
      this.candle_CB = false;
      this.oil_CB = false;
      this.accessory_CB = false;
      this.gift_CB = false;
    }
    // this.SyncUpCheckBoxChildComponent();

    this.SyncUpCheckBoxChildComponent();
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    // Initialization logic here  
    this.filteredProduct.filterChanged$.subscribe((filteredCandles) => {
      if (filteredCandles) {
        this.candles = filteredCandles;
        console.log("Filtered candles in diffuse candles:", this.candles);
      }
    });
  }
  getCandleUrl(candle: any): string {
    return '/candle_information/' + (candle.name || '').replace(/ /g, '_');
  }

  SyncUpCheckBoxChildComponent(): void {
    this.CheckBoxValueArrayParentComponent = [
    [this.candle_CB, this.oil_CB, this.accessory_CB, this.gift_CB],
    [this.best_saler_CB, this.discount_CB, this.new_arrival_CB, this.sweet_fruit_CB, this.wood_men_CB, this.fresh_relax_CB, this.flower_herb_CB],
    [this.lumos_CB, this.citta_CB, this.no_brand_CB],
    [this.smaller_100KVND_CB, this.HundredKVND_to_200KVND_CB, this.TwoHundredKVND_to_300KVND_CB, this.ThreeHundredKVND_to_500KVND_CB, this.larger_500KVND_CB],
    [this.black_CB, this.white_CB, this.red_CB, this.pink_CB, this.blue_CB, this.green_CB, this.yellow_CB, this.orange_CB, this.purple_CB]
  ];
  }

  onFilterChanged(data_request_filter: object) {   
    // Handle the filter data here
    let candlesObservable: Observable<Candles[]>;
    console.log("Received filter data in common product component:", data_request_filter);
    candlesObservable = this.candlesService.getAllCandlesByFilter(data_request_filter);
    candlesObservable.subscribe((serverCandles) => {
    this.candles = serverCandles; // Assign the final data to the component property
    console.log("Response from serve",this.candles);
    // Scenario 2: If want user must login before access the website
    // if(this.candles[0].status == "Session is timeout"){
    //   console.log("Session is timeout");
    //   this.identification.ClearSessionStorage();
    //   this.identification.SetisUserIdentifiedMain(false);
    //   this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
    // }  
    // else {
    //   // status is "Session is normal"
    // }
    });
  }
}
