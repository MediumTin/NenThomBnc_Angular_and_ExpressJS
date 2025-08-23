import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { PaymentService } from '../../../Services/payment/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-bag',
  imports: [CommonModule],
  templateUrl: './shopping-bag.component.html',
  styleUrl: './shopping-bag.component.css'
})
export class ShoppingBagComponent {
    PersonalShoppingBags : string = "";
    account: string = "";
      constructor(private router:Router, private identification: IndentificationService, private paymentService: PaymentService) {
    const sessionInfo = this.identification.GetSessionID();
    if (sessionInfo.Username != "") {
      // this.isUserIdentifiedMain = true;
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
        }
      });
    } else {
      // User is not identified, handle accordingly - request login
      // this.isUserIdentifiedMain = false;
      this.identification.SetisUserIdentifiedMain(false);
      console.log("User has not identified yet in app component");
      this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      
    }
   }
}
