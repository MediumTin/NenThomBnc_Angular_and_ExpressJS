import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  selector: 'app-test',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule, CommonModule, RouterModule,FilterBarComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TESTComponent {
  candles: Candles[] = [];
  constructor(private filteredProduct : FilteredProductService, private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService )
  { 
    //   var data_request_filter = 
    //   {   name: "Request_Filter_Product", 
    //       Request_Of_Type: "accessory", 
    //       Request_Of_Group: "best_seller,discount,new_arrival,sweet_fruit,wood_men,fresh_relax,flower_herb", 
    //       Request_Of_Brand: "lumos,citta,no_brand", 
    //       Request_Of_Price: "smaller_100KVND,100KVND_to_200KVND,200KVND_to_300KVND,300KVND_to_500KVND,larger_500KVND", 
    //       Request_Of_Color: "black,white,red,pink,blue,green,yellow,orange,purple" 
    //   } ; 
    //   let candlesObervalbe: Observable<Candles[]>;
    //   candlesObervalbe = this.candlesService.getAllCandlesByFilter(data_request_filter);
    //   candlesObervalbe.subscribe((serverCandles) => {
    //   this.candles = serverCandles; // Assign the final data to the component property
    //   console.log("Response from serve",this.candles);
    //   // console.log(`TotalLengh of received info : ${this.candles.length}`);
    //   if(this.candles[0].status == "Session is timeout"){
    //     console.log("Session is timeout");
    //     this.identification.ClearSessionStorage();
    //     this.identification.SetisUserIdentifiedMain(false);
    //     this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
    //   }  
    //   else {
    //     // status is "Session is normal"
    //   }
    // });

  };
  getCandleUrl(candle: any): string {
    return '/candle_information/' + (candle.name || '').replace(/ /g, '_');
  }
  onFilterChanged(data_request_filter: object) {   
    // // Handle the filter data here
    // let candlesObservable: Observable<Candles[]>;
    // candlesObservable = this.candlesService.getAllCandlesByFilter(data_request_filter);
    // candlesObservable.subscribe((serverCandles) => {
    // this.candles = serverCandles; // Assign the final data to the component property
    // console.log("Response from serve",this.candles);
    // // console.log(`TotalLengh of received info : ${this.candles.length}`);
    // if(this.candles[0].status == "Session is timeout"){
    //   console.log("Session is timeout");
    //   this.identification.ClearSessionStorage();
    //   this.identification.SetisUserIdentifiedMain(false);
    //   this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
    // }  
    // else {
    //   // status is "Session is normal"
    // }
    // });
  }
}
// export class TESTComponent implements OnInit, AfterViewInit{
//   candles: Candles[] = [];
//   isUserIdentified : UserInformation[] =[];
//   // @ViewChild('pTag', { static: false }) pTag!: ElementRef<HTMLTableElement>;

//   constructor(private filterbar : FilterBarComponent, private filteredProduct : FilteredProductService, private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService )
//   { 
//     //   var data_request_filter = 
//     //   {   name: "Request_Filter_Product", 
//     //       Request_Of_Type: "accessory", 
//     //       Request_Of_Group: "best_seller,discount,new_arrival,sweet_fruit,wood_men,fresh_relax,flower_herb", 
//     //       Request_Of_Brand: "lumos,citta,no_brand", 
//     //       Request_Of_Price: "smaller_100KVND,100KVND_to_200KVND,200KVND_to_300KVND,300KVND_to_500KVND,larger_500KVND", 
//     //       Request_Of_Color: "black,white,red,pink,blue,green,yellow,orange,purple" 
//     //   } ; 
//     //   let candlesObervalbe: Observable<Candles[]>;
//     //   candlesObervalbe = this.candlesService.getAllCandlesByFilter(data_request_filter);
//     //   candlesObervalbe.subscribe((serverCandles) => {
//     //   this.candles = serverCandles; // Assign the final data to the component property
//     //   console.log("Response from serve",this.candles);
//     //   // console.log(`TotalLengh of received info : ${this.candles.length}`);
//     //   if(this.candles[0].status == "Session is timeout"){
//     //     console.log("Session is timeout");
//     //     this.identification.ClearSessionStorage();
//     //     this.identification.SetisUserIdentifiedMain(false);
//     //     this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
//     //   }  
//     //   else {
//     //     // status is "Session is normal"
//     //   }
//     // });

//   };

//   ngAfterViewInit(): void {
//     // this.filterbar.setCheckboxValue('accessory', true);
//     // throw new Error('Method not implemented.');
//   }
//   ngOnInit(): void {
//     // // Initialization logic here  
//     // this.filteredProduct.filterChanged$.subscribe((filteredCandles) => {
//     //   if (filteredCandles) {
//     //     this.candles = filteredCandles;
//     //     console.log("Filtered candles in diffuse candles:", this.candles);
//     //   }
//     //   this.filterbar.setCheckboxValue('candle', false);
//     //   this.filterbar.setCheckboxValue('oil', false);
//     //   this.filterbar.setCheckboxValue('accessory', false);
//     //   this.filterbar.setCheckboxValue('gift', false);
//     //   this.filterbar.setCheckboxValue('best_saler', false);
//     //   this.filterbar.setCheckboxValue('discount', false);
//     //   this.filterbar.setCheckboxValue('new_arrival', false);
//     //   this.filterbar.setCheckboxValue('sweet_fruit', false);
//     //   this.filterbar.setCheckboxValue('wood_men', false);
//     //   this.filterbar.setCheckboxValue('fresh_relax', false);
//     //   this.filterbar.setCheckboxValue('flower_herb', false);
//     //   this.filterbar.setCheckboxValue('lumos', false);
//     //   this.filterbar.setCheckboxValue('citta', false);
//     //   this.filterbar.setCheckboxValue('no_brand', false);
//     //   this.filterbar.setCheckboxValue('smaller_100KVND', false);
//     //   this.filterbar.setCheckboxValue('100KVND_to_200KVND', false);
//     //   this.filterbar.setCheckboxValue('200KVND_to_300KVND', false);
//     //   this.filterbar.setCheckboxValue('300KVND_to_500KVND', false);
//     //   this.filterbar.setCheckboxValue('larger_500KVND', false);
//     //   this.filterbar.setCheckboxValue('black', false);
//     //   this.filterbar.setCheckboxValue('white', false);
//     //   this.filterbar.setCheckboxValue('red', false);
//     //   this.filterbar.setCheckboxValue('pink', false);
//     //   this.filterbar.setCheckboxValue('blue', false);
//     //   this.filterbar.setCheckboxValue('green', false);
//     //   this.filterbar.setCheckboxValue('yellow', false);
//     //   this.filterbar.setCheckboxValue('orange', false);
//     //   this.filterbar.setCheckboxValue('purple', false);
//     // });
//     // throw new Error('Method not implemented.');
//   }
//   getCandleUrl(candle: any): string {
//     return '/candle_information/' + (candle.name || '').replace(/ /g, '_');
//   }

//   onFilterChanged(data_request_filter: object) {   
//     // // Handle the filter data here
//     // let candlesObservable: Observable<Candles[]>;
//     // candlesObservable = this.candlesService.getAllCandlesByFilter(data_request_filter);
//     // candlesObservable.subscribe((serverCandles) => {
//     // this.candles = serverCandles; // Assign the final data to the component property
//     // console.log("Response from serve",this.candles);
//     // // console.log(`TotalLengh of received info : ${this.candles.length}`);
//     // if(this.candles[0].status == "Session is timeout"){
//     //   console.log("Session is timeout");
//     //   this.identification.ClearSessionStorage();
//     //   this.identification.SetisUserIdentifiedMain(false);
//     //   this.router.navigate(['/login_handling']); // Navigate to login handling page internal in Angular
//     // }  
//     // else {
//     //   // status is "Session is normal"
//     // }
//     // });
//   }
// }
