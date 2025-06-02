import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../Services/food/food.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Food } from '../../../Common_Configuration/Models/Food';
import { CartService } from '../../../Services/cart/cart.service';
import { NotFoundComponent } from "../../Partials/not-found/not-found.component";
import { StarRatingComponent } from "../../Partials/star-rating/star-rating.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-page',
  imports: [NotFoundComponent, StarRatingComponent, CommonModule, RouterModule],
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css'
})
export class FoodPageComponent implements OnInit {
  food!: Food;
  constructor(activatedRoute:ActivatedRoute, foodService:FoodService,
    private cartService:CartService, private router: Router) {
    activatedRoute.params.subscribe((params) => {
      if(params['id'])
      foodService.getFoodById(params['id']).subscribe(serverFood => {
        this.food = serverFood;
      });
    })
   }

  ngOnInit(): void {
  }

  addToCart(){
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
