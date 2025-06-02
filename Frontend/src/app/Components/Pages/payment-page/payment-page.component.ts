import { Component, OnInit } from '@angular/core';
import { Order } from '../../../Common_Configuration/Models/Order';
import { OrderService } from '../../../Services/order/order.service';
import { Router } from '@angular/router';
import { TitleComponent } from "../../Partials/title/title.component";
import { OrderItemsListComponent } from "../../Partials/order-items-list/order-items-list.component";
import { PaypalButtonComponent } from "../../Partials/paypal-button/paypal-button.component";
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../Partials/map/map.component';

@Component({
  selector: 'app-payment-page',
  imports: [TitleComponent, OrderItemsListComponent, PaypalButtonComponent, CommonModule, MapComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit {

  order:Order = new Order();
  constructor(orderService: OrderService, router: Router) {
      orderService.getNewOrderForCurrentUser().subscribe({
        next: (order) => {
          this.order = order;
        },
        error:() => {
          router.navigateByUrl('/chekcout');
        }
      })

   }

  ngOnInit(): void {
  }

}
