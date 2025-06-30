import { AfterViewInit, Component, ElementRef, importProvidersFrom, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Candles } from '../../../Common_Configuration/Models/Candles';
import { UserInformation } from '../../../Common_Configuration/Models/UserInformation';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { FilteredProductService } from '../../../Services/FilteredService/filtered-product.service';

@Component({
  selector: 'app-care-candles',
standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './care-candles.component.html',
  styleUrl: './care-candles.component.css'
})
export class CareCandlesComponent implements OnInit, AfterViewInit {
  candles: Candles[] = [];
  isUserIdentified : UserInformation[] =[];
  @ViewChild('tableMenu', { static: false }) tableMenu!: ElementRef<HTMLTableElement>;
  // @ViewChild('pTag', { static: false }) pTag!: ElementRef<HTMLTableElement>;

  constructor(private filteredProduct : FilteredProductService, private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService ) { 
    let candlesObervalbe: Observable<Candles[]>;
      console.log("User has identified yet");
      activatedRoute.params.subscribe((params) => {
        if (params['searchTerm']){
          candlesObervalbe = this.candlesService.getAllCandlesBySearchTerm(params['searchTerm']);
        }
        else if (params['tag']) {
          candlesObervalbe = this.candlesService.getAllCandlesByTag(params['tag']);
        }
        else if (params['filter']) {
          candlesObervalbe = this.candlesService.getAllCandlesByFilter(params['filter']);
        }
        else {
          candlesObervalbe = this.candlesService.getAllCandles();
        } 
        candlesObervalbe.subscribe((serverCandles) => {
          this.candles = serverCandles; // Assign the final data to the component property
          console.log("Response from serve",this.candles);
          // console.log(`TotalLengh of received info : ${this.candles.length}`);
          if(this.candles[0].status == "Session is timeout"){
            console.log("Session is timeout");
            this.identification.ClearSessionStorage();
            this.identification.SetisUserIdentifiedMain(false);
            this.router.navigate(['/login_handling']);
          }  
          else {
            // status is "Session is normal"
            this.loadProducts();
          }
        });
      });

  };
  
  loadProducts() {
    // const pTag = this.pTag.nativeElement;
    // pTag.innerHTML = `New hee`;
    var temp = 0;
    let stringtemp = "";
    let myarray = "";
    let TotalLengh : number = 0; // default value
    let TotalRow  : number = 0; // default value
    let TotalColum  : number = 4; // fixed value
    let RedundantRow  : number = 0; // default value for 
    let ActualRow   : number = 0;
    let receivedMessage = "";
    let StringForRow : string = "";
    // const tablemenu = document.querySelector<HTMLTableElement>('#table_menu');
    const tableMenu = this.tableMenu.nativeElement;
    // tableMenu.innerHTML = '<tr><td>New Row</td></tr>';
    TotalLengh = this.candles.length;
    console.log(`TotalLengh of received info : ${TotalLengh}`);
    TotalRow = Math.round(TotalLengh/TotalColum);
    RedundantRow = TotalLengh%TotalColum;
    console.log(`Lenght of received info : ${RedundantRow}`);
    if (RedundantRow == 0){
      ActualRow = TotalRow;
    }
    else {
        ActualRow = TotalRow + 1;
    }
    console.log(`ActualRow : ${ActualRow}`);
    for(var row = 1;row<=ActualRow;row++){
        console.log(`Row number : ${row}`);
        // const fruitsList = document.querySelector(`#row${row}`);
        if(RedundantRow != 0 && row == ActualRow){
            // odd case, last row (redundant row)
            for(var col = 1;col<=RedundantRow;col++){
                stringtemp = `${this.candles[temp].name}`;
                myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                StringForRow += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${this.candles[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${this.candles[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${this.candles[temp].price}</p></a></th>`;
                temp = temp + 1;
            }
        }
        else {
            // Normal case , no odd length
            for(var col = 1;col<=TotalColum;col++){
                stringtemp = `${this.candles[temp].name}`;
                myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                StringForRow += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${this.candles[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${this.candles[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${this.candles[temp].price}</p></a></th>`;
                temp = temp + 1;
            }
        }
        tableMenu.innerHTML += `<tr id="row${row}">${StringForRow}</tr>`;
        console.log(`StringForRow info row${row} : ${StringForRow}`);
        StringForRow = ""; // reset the string for next row
      }
  }


  ngAfterViewInit(): void  {  
    // this.loadProducts();
    // this.setCheckboxValue('gift', true);
  }
  ngOnInit(): void {
    // Initialization logic here  
    this.filteredProduct.filterChanged$.subscribe((filteredCandles) => {
      if (filteredCandles) {
        this.candles = filteredCandles;
        console.log("Filtered candles in diffuse candles:", this.candles);
      }
            this.setCheckboxValue('candle', false);
            this.setCheckboxValue('oil', false);
            this.setCheckboxValue('accessory', false);
            this.setCheckboxValue('gift', false);
            this.setCheckboxValue('best_saler', false);
            this.setCheckboxValue('discount', false);
            this.setCheckboxValue('new_arrival', false);
            this.setCheckboxValue('sweet_fruit', false);
            this.setCheckboxValue('wood_men', false);
            this.setCheckboxValue('fresh_relax', false);
            this.setCheckboxValue('flower_herb', false);
            this.setCheckboxValue('lumos', false);
            this.setCheckboxValue('citta', false);
            this.setCheckboxValue('no_brand', false);
            this.setCheckboxValue('smaller_100KVND', false);
            this.setCheckboxValue('100KVND_to_200KVND', false);
            this.setCheckboxValue('200KVND_to_300KVND', false);
            this.setCheckboxValue('300KVND_to_500KVND', false);
            this.setCheckboxValue('larger_500KVND', false);
            this.setCheckboxValue('black', false);
            this.setCheckboxValue('white', false);
            this.setCheckboxValue('red', false);
            this.setCheckboxValue('pink', false);
            this.setCheckboxValue('blue', false);
            this.setCheckboxValue('green', false);
            this.setCheckboxValue('yellow', false);
            this.setCheckboxValue('orange', false);
            this.setCheckboxValue('purple', false);
    });
    
  }
  getCandleUrl(candle: any): string {
    return '/candle_information/' + (candle.name || '').replace(/ /g, '_');
  }
  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.id, input.checked); // Xử lý logic filter ở đây
    // Ví dụ: cập nhật danh sách filter, gọi API, v.v.
    var Result_Of_Type = "", Result_Of_Group = "", Result_Of_Brand = "", Result_Of_Price = "", Result_Of_Color = "";
    var Number_Of_A = 0, Number_Of_B = 0, Number_Of_C = 0, Number_Of_D = 0, Number_Of_E = 0;
    var Filter_Of_A= [], Filter_Of_B= [], Filter_Of_C= [], Filter_Of_D= [], Filter_Of_E= [];

                    
  const getChecked = (id: string, value: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    return el && el.checked ? value : "";
  };
  const A = [
    getChecked("candle", "candle"),
    getChecked("oil", "oil"),
    getChecked("accessory", "accessory"),
    getChecked("gift", "gift")
  ];
  const B = [
    getChecked("best_saler", "best_seller"),
    getChecked("discount", "discount"),
    getChecked("new_arrival", "new_arrival"),
    getChecked("sweet_fruit", "sweet_fruit"),
    getChecked("wood_men", "wood_men"),
    getChecked("fresh_relax", "fresh_relax"),
    getChecked("flower_herb", "flower_herb")
  ];
  const C = [
    getChecked("lumos", "lumos"),
    getChecked("citta", "citta"),
    getChecked("no_brand", "no_brand")
  ];
  const D = [
    getChecked("smaller_100KVND", "smaller_100KVND"),
    getChecked("100KVND_to_200KVND", "100KVND_to_200KVND"),
    getChecked("200KVND_to_300KVND", "200KVND_to_300KVND"),
    getChecked("300KVND_to_500KVND", "300KVND_to_500KVND"),
    getChecked("larger_500KVND", "larger_500KVND")
  ];
  const E = [
    getChecked("black", "black"),
    getChecked("white", "white"),
    getChecked("red", "red"),
    getChecked("pink", "pink"),
    getChecked("blue", "blue"),
    getChecked("green", "green"),
    getChecked("yellow", "yellow"),
    getChecked("orange", "orange"),
    getChecked("purple", "purple")
  ];
  for(let i = 0; i<4;i++){
      if(A[i] != ""){
          Filter_Of_A[Number_Of_A] = A[i];   
          Number_Of_A++;
      }
      // console.log(`Result of A${i+1} is`,A[i]);
  }
  if(Number_Of_A != 0){
      Result_Of_Type = Filter_Of_A.join(',');
  }
  else {
      // Result_Of_Type = "A1 || A2 || A3 || A4";
      Filter_Of_A = ["candle","oil","accessory","gift"];
      Result_Of_Type = Filter_Of_A.join(',');
      // Result_Of_Type = ["A1","A2","A3","A4"];
  }
  // console.log("Result of A",Result_Of_Type);

  for(let i = 0; i<7;i++){
      if(B[i] != ""){
          Filter_Of_B[Number_Of_B] = B[i];   
          Number_Of_B++;
      }
      // console.log(`Result of B${i+1} is`,B[i]);
  }
  if (Number_Of_B !=0){
      Result_Of_Group = Filter_Of_B.join(',');
  }
  else {
      Filter_Of_B = ["best_seller","discount","new_arrival","sweet_fruit","wood_men","fresh_relax","flower_herb"];
      Result_Of_Group = Filter_Of_B.join(',');
      // Result_Of_Group = "B1 || B2 || B3 || B4 || B5 || B6 || B7";
  }
  // console.log("Result of B",Result_Of_Group);
  for(let i = 0; i<3;i++){
      if(C[i] != ""){
          Filter_Of_C[Number_Of_C] = C[i];   
          Number_Of_C++;
      }
      // console.log(`Result of C${i+1} is`,C[i]);
  }
  if (Number_Of_C !=0){
      Result_Of_Brand = Filter_Of_C.join(',');
  } 
  else {
      Filter_Of_C = ["lumos","citta","no_brand"];
      Result_Of_Brand = Filter_Of_C.join(',');
      // Result_Of_Brand = "C1 || C2 || C3";
  }

  for(let i = 0; i<5;i++){
      if(D[i] != ""){
          Filter_Of_D[Number_Of_D] = D[i];   
          Number_Of_D++;
      }
      // console.log(`Result of D${i+1} is`,D[i]);
  }
  if (Number_Of_D !=0){
      Result_Of_Price = Filter_Of_D.join(',');
  } 
  else {
      Filter_Of_D = ["smaller_100KVND","100KVND_to_200KVND","200KVND_to_300KVND","300KVND_to_500KVND","larger_500KVND"];
      Result_Of_Price = Filter_Of_D.join(',');
      // Result_Of_Price = "D1 || D2 || D3 || D4 || D5";
  }

  for(let i = 0; i<9;i++){
      if(E[i] != ""){
          Filter_Of_E[Number_Of_E] = E[i];   
          Number_Of_E++;
      }
      // console.log(`Result of E${i+1} is`,E[i]);
  }
  if (Number_Of_E != 0){
      Result_Of_Color = Filter_Of_E.join(',');
  } 
  else {
      Filter_Of_E = ["black","white","red","pink","blue","green","yellow","orange","purple"];
      Result_Of_Color = Filter_Of_E.join(',');
      // Result_Of_Color = "E1 || E2 || E3 || E4 || E5 || E6 || E7";
  } 
  
  console.log(`A = ${Result_Of_Type}`);
  console.log(`B = ${Result_Of_Group}`);
  console.log(`C = ${Result_Of_Brand}`);
  console.log(`D = ${Result_Of_Price}`);
  console.log(`E = ${Result_Of_Color}`);
  var data_request_filter = 
    {   name: "Request_Filter_Product", 
        Request_Of_Type: `${Result_Of_Type}`, 
        Request_Of_Group: `${Result_Of_Group}`, 
        Request_Of_Brand: `${Result_Of_Brand}`, 
        Request_Of_Price: `${Result_Of_Price}`, 
        Request_Of_Color: `${Result_Of_Color}` 
    } 
  ; 
    let candlesObervalbe: Observable<Candles[]>;
    candlesObervalbe = this.candlesService.getAllCandlesByFilter(data_request_filter);
    candlesObervalbe.subscribe((serverCandles) => {
    this.candles = serverCandles; // Assign the final data to the component property
    console.log("Response from serve",this.candles);
    // console.log(`TotalLengh of received info : ${this.candles.length}`);
    if(this.candles[0].status == "Session is timeout"){
      console.log("Session is timeout");
      this.identification.ClearSessionStorage();
      this.identification.SetisUserIdentifiedMain(false);
      this.router.navigate(['/login_handling']);
    }  
    else {
      // status is "Session is normal"
      this.loadProducts();
    }
  });
  }
  setCheckboxValue(id: string, checked: boolean): void {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) {
      el.checked = checked;
    }
  }

}
