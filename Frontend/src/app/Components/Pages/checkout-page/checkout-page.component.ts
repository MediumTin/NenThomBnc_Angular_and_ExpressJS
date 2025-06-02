import { Component, OnInit } from '@angular/core';
import { Order } from '../../../Common_Configuration/Models/Order';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../Services/cart/cart.service';
import { UserService } from '../../../Services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../Services/order/order.service';
import { Router } from '@angular/router';
import { TitleComponent } from "../../Partials/title/title.component";
import { OrderItemsListComponent } from "../../Partials/order-items-list/order-items-list.component";
import { TextInputComponent } from "../../Partials/text-input/text-input.component";
import { MapComponent } from '../../Partials/map/map.component';

@Component({
  selector: 'app-checkout-page',
  imports: [TitleComponent, OrderItemsListComponent, TextInputComponent, ReactiveFormsModule,MapComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  order:Order = new Order();
  checkoutForm!: FormGroup;
  constructor(cartService:CartService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private toastrService: ToastrService,
              private orderService: OrderService,
              private router: Router) 
              {
                const cart = cartService.getCart();
                this.order.items = cart.items;
                this.order.totalPrice = cart.totalPrice;
              }

  ngOnInit(): void {
    let {name, address} = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name:[name, Validators.required],
      address:[address, Validators.required]
    });
  }

  get fc(){
    return this.checkoutForm.controls;
  }

  createOrder(){
    if(this.checkoutForm.invalid){
      this.toastrService.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }

    if(!this.order.addressLatLng){
      this.toastrService.warning('Please select your location on the map', 'Location');
      return;
    }

    this.order.name = this.fc['name'].value;
    this.order.address = this.fc['address'].value;

    this.orderService.create(this.order).subscribe({
      next:() => {
        this.router.navigateByUrl('/payment');
      },
      error:(errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Cart');
      }
    })
  }
}

