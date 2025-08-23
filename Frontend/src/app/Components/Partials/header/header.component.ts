import { Component, OnInit } from '@angular/core';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilteredProductService } from '../../../Services/FilteredService/filtered-product.service';
import { Candles } from '../../../Common_Configuration/Models/Candles';
import { Observable } from 'rxjs';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  
  Identified_Current_User : string = "";
  showClickedMessage = false;
  searchTerm: string = '';
  candles: Candles[] = [];
  AllCandles: Candles[] = [];
  filteredProducts: Candles[] = [];
  products: { id: number; name: string; price: number; }[] = []; // Declare products as an empty array

  constructor(private router:Router, private identification: IndentificationService, private filteredProduct : FilteredProductService, private candlesService : CandlesServiceService) { 
    const sessionInfo = this.identification.GetSessionID();
    this.Identified_Current_User = sessionInfo.Username;
    console.log("Got SessionID is: ",`${sessionInfo.SessionID}`, "Got Username is: ",`${sessionInfo.Username}`);	 
  }
  ngOnInit() {
  // Lấy danh sách sản phẩm từ server hoặc gán cứng
    this.products = [
      { id: 1, name: 'one', price: 100 },
      { id: 2, name: 'two', price: 200 },
      { id: 3, name: 'three', price: 300 },
    ]; // dữ liệu sản phẩm
    
  }
  onSearch() {
    let candlesObervalbe: Observable<Candles[]>; 
    candlesObervalbe = this.candlesService.getAllCandles();
    candlesObervalbe.subscribe((serverCandles) => {
      this.AllCandles = serverCandles; // Assign the final data to the component property
      console.log("Response from serve",this.AllCandles);
      // console.log(`TotalLengh of received info : ${this.candles.length}`);
      if(this.AllCandles[0].status == "Session is timeout"){
        console.log("Session is timeout");
        this.identification.ClearSessionStorage();
        this.identification.SetisUserIdentifiedMain(false);
        this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      }  
      else {
        // status is "Session is normal"
        // this.candles = this.AllCandles;
        const term = this.searchTerm.trim().toLowerCase();
        this.candles = this.AllCandles.filter(AllCandle =>
          AllCandle.name.toLowerCase().includes(term)
        );
        console.log("Filtered products in header component:", this.candles);
        this.filteredProduct.notifyFilterChanged(this.candles);
      }
    });
  
  }
  MoveToPaymentPage() {
    this.router.navigate(['/payment_handling']);  // Navigate to login handling page internal in Angular
    // throw new Error('Method not implemented.');
  }
  LogOut() {
    // throw new Error('Method not implemented.');
    console.log("Session is timeout");
    this.identification.ClearSessionStorage();
    this.identification.SetisUserIdentifiedMain(false);
    this.identification.clearAllCookies();
    this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
  }
}
