import { Component, OnInit } from '@angular/core';
import { Food } from '../../../Common_Configuration/Models/Food';
import { FoodService } from '../../../Services/food/food.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StarRatingComponent } from "../../Partials/star-rating/star-rating.component";
import { TagsComponent } from "../../Partials/tags/tags.component";
import { NotFoundComponent } from "../../Partials/not-found/not-found.component";
import { SearchComponent } from "../../Partials/search/search.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [StarRatingComponent, RouterModule, TagsComponent, NotFoundComponent, SearchComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];
  constructor(private foodService: FoodService, activatedRoute: ActivatedRoute) {
    let foodsObservalbe:Observable<Food[]>;
    activatedRoute.params.subscribe((params) => {
      if (params['searchTerm'])
        foodsObservalbe = this.foodService.getAllFoodsBySearchTerm(params['searchTerm']);
      else if (params['tag'])
        foodsObservalbe = this.foodService.getAllFoodsByTag(params['tag']);
      else
        foodsObservalbe = foodService.getAll();

        foodsObservalbe.subscribe((serverFoods) => {
          this.foods = serverFoods;
        })
    })
  }

  ngOnInit(): void {
  }

}
