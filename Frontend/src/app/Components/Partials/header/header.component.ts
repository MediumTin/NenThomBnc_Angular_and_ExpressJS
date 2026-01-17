import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilteredProductService } from '../../../Services/FilteredService/filtered-product.service';
import { Candles } from '../../../Common_Configuration/Models/Candles';
import { Observable } from 'rxjs';
import { CandlesServiceService } from '../../../Services/CandlesService/candles-service.service';
import { FilterBarComponent } from "../../filter-bar/filter-bar.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, FilterBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isCheckShoppingBagVisible: boolean = false; // Default visibility of the shopping bag check
  isAdminRightValid: boolean = false;
  Identified_Current_User : string = "";
  showClickedMessage = false;
  searchTerm: string = '';
  candles: Candles[] = [];
  AllCandles: Candles[] = [];
  filteredProducts: Candles[] = [];
  products: { id: number; name: string; price: number; }[] = []; // Declare products as an empty array

  constructor(private router:Router, private identification: IndentificationService, private filteredProduct : FilteredProductService, private candlesService : CandlesServiceService, private cdr: ChangeDetectorRef) { 
    const sessionInfo = this.identification.GetSessionID();
    
    // Below is behavior subject to track admin right from identification service
    this.identification.isAdminValidMain.subscribe(val => {
      this.isAdminRightValid = val;
    });

    // Below is behavior subject to track current user from identification service
    this.identification.currentUser_Observe.subscribe(val => {
      this.Identified_Current_User = val;
    });
    console.log("Admin right in header component is ", this.identification.GetisAdminAccepted());
    console.log("Got Username is: ",`${sessionInfo.Username}`);	 
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
      // Scenario 1: If want user can access the website without login
      const term = this.searchTerm.trim().toLowerCase();
      this.candles = this.AllCandles.filter(AllCandle =>
        AllCandle.name.toLowerCase().includes(term)
      );
      console.log("Filtered products in header component:", this.candles);
      this.filteredProduct.notifyFilterChanged(this.candles);

      // Scenario 2: If want user must login before access the website
      // if(this.AllCandles[0].status == "Session is timeout"){
      //   console.log("Session is timeout");
      //   this.identification.ClearSessionStorage();
      //   this.identification.SetisUserIdentifiedMain(false);
      //   this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      // }  
      // else {
      //   const term = this.searchTerm.trim().toLowerCase();
      //   this.candles = this.AllCandles.filter(AllCandle =>
      //     AllCandle.name.toLowerCase().includes(term)
      //   );
      //   console.log("Filtered products in header component:", this.candles);
      //   this.filteredProduct.notifyFilterChanged(this.candles);
      // }
    });
  
  }
  MoveToPaymentPage() {
    if(this.Identified_Current_User == "" || this.Identified_Current_User == null) {
        // Call confirme box
        this.isCheckShoppingBagVisible = true;
        this.AddedBoxFadeOut();
      }
      else {
        this.router.navigate(['/payment_handling']);  // Navigate to login handling page internal in Angular
      } 
  }

  Login_now() {
    // Turn off the confirme box
    this.isCheckShoppingBagVisible = false;
    this.router.navigate(['/login_handling']);  
  }

  Login_later(){
    // Turn off the confirme box
    this.isCheckShoppingBagVisible = false;
  }
  AddedBoxFadeOut() {
    setTimeout(
        () =>{
            this.isCheckShoppingBagVisible = false;
        }
        ,
        3000
    );
  }

  LogOut() {
    // throw new Error('Method not implemented.');
    console.log("Session is timeout");
    this.identification.ClearSessionStorage();
    this.identification.SetisUserIdentifiedMain(false);
    this.identification.clearAllCookies();
    this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
  }
  AddNewProductForAdminRight() {
    this.router.navigate(['/add_new_product']);  // Navigate to add new product page internal in Angular
  }
  ManageOrderAdminRight() {
    this.router.navigate(['/manage_order_adminright']);  // Navigate to add new product page internal in Angular
  }
}
