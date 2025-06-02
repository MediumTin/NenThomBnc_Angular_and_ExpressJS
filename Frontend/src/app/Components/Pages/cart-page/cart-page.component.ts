import { Component, OnInit } from '@angular/core';
import { Cart } from '../../../Common_Configuration/Models/Cart';
import { CartService } from '../../../Services/cart/cart.service';
import { CartItem } from '../../../Common_Configuration/Models/CartItem';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from "../../Partials/not-found/not-found.component";
import { TitleComponent } from "../../Partials/title/title.component";

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, RouterModule, NotFoundComponent, TitleComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    })
   }

  ngOnInit(): void {
  }

  removeFromCart(cartItem:CartItem){
    this.cartService.removeFromCart(cartItem.food.id);
  }

  changeQuantity(cartItem:CartItem,quantityInString:string){
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
  }

}
