import { AfterViewInit, Component, ElementRef, importProvidersFrom, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { UserInformation } from '../../Common_Configuration/Models/UserInformation';
import { CandlesServiceService } from '../../Services/CandlesService/candles-service.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { IndentificationService } from '../../Services/IdentificationService/indentification.service';

// import { AuthInterceptor } from '../../auth/auth.interceptor';
// import { LoadingInterceptor } from '../../Common_Configuration/Interceptors/loading.interceptor';



@Component({
  selector: 'candles-component',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule],
  // providers: [
  //   {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true },
  //   {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true } 
  // ],
  templateUrl: './candles-component.component.html',
  styleUrl: './candles-component.component.css'
})
export class CandlesComponent implements OnInit, AfterViewInit {
  candles: Candles[] = [];
  isUserIdentified : UserInformation[] =[];
  @ViewChild('tableMenu', { static: false }) tableMenu!: ElementRef<HTMLTableElement>;
  // @ViewChild('pTag', { static: false }) pTag!: ElementRef<HTMLTableElement>;
  constructor(private router:Router, private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute, private renderer:Renderer2,private identification: IndentificationService ) { 
    let candlesObervalbe: Observable<Candles[]>;
    const sessionInfo = this.identification.GetSessionID();
    if(sessionInfo.Username != ""){
      this.identification.SetisUserIdentifiedMain(true);
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
            this.identification.SetisUserIdentifiedMain(false);
            this.router.navigate(['/login_handling']);
            
          }  
          else {
            // console.log("Session is not timeout");
            this.loadProducts();
          }
        });
      });
    }
    else {
      // User is not identified, handle accordingly - request login
      this.identification.SetisUserIdentifiedMain(false);
      console.log("User has not identified yet");
      this.router.navigate(['/login_handling']);
    }

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
  }
  ngOnInit(): void {
    // Initialization logic here  
    
  }

}


