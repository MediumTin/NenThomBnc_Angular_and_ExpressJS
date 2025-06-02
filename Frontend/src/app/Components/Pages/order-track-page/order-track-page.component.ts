import { Component, OnInit } from '@angular/core';
import { Order } from '../../../Common_Configuration/Models/Order';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../Services/order/order.service';
import { OrderItemsListComponent } from "../../Partials/order-items-list/order-items-list.component";
import { TitleComponent } from "../../Partials/title/title.component";
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../Partials/map/map.component';

@Component({
  selector: 'app-order-track-page',
  imports: [OrderItemsListComponent, TitleComponent, CommonModule, MapComponent],
  templateUrl: './order-track-page.component.html',
  styleUrl: './order-track-page.component.css'
})
export class OrderTrackPageComponent implements OnInit {

  order!:Order;
  constructor(activatedRoute: ActivatedRoute,
              orderService:OrderService) {
     const params = activatedRoute.snapshot.params;
     if(!params['orderId']) return;

     orderService.trackOrderById(params['orderId']).subscribe(order => {
       this.order = order;
     })

  }

  ngOnInit(): void {
  }

}
