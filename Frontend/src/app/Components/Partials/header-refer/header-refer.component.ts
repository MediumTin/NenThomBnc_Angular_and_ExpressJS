import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user/user.service';
import { CartService } from '../../../Services/cart/cart.service';
import { User } from '../../../Common_Configuration/Models/User';

@Component({
  selector: 'app-header-refer',
  imports: [],
  templateUrl: './header-refer.component.html',
  styleUrl: './header-refer.component.css'
})
export class HeaderReferComponent implements OnInit {

  cartQuantity=0;
  user!:User;
  constructor(cartService:CartService,private userService:UserService) {
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
   }

  ngOnInit(): void {
    
  }

  logout(){
    this.userService.logout();
  }

  get isAuth(){
    return this.user.token;
  }
}
