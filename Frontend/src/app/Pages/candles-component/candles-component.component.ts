import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { Candles } from '../../Common_Configuration/Models/Candles';
import { CandlesServiceService } from '../../Services/candles-service.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

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
export class CandlesComponent implements OnInit {
  candles: Candles[] = [];
  constructor(private candlesService : CandlesServiceService,activatedRoute: ActivatedRoute ) { 
    let candlesObervalbe: Observable<Candles[]>;
    activatedRoute.params.subscribe((params) => {
      if (params['searchTerm'])
        candlesObervalbe = this.candlesService.getAllCandlesBySearchTerm(params['searchTerm']);
      else if (params['tag'])
        candlesObervalbe = this.candlesService.getAllCandlesByTag(params['tag']);
      else
        candlesObervalbe = this.candlesService.getAllCandles();
        candlesObervalbe.subscribe((serverCandles) => {
          this.candles = serverCandles; // Assign the final data to the component property
          console.log("Response from serve",this.candles);
        })
    })
  }

  ngOnInit(): void {
    // Initialization logic here
  }

}


