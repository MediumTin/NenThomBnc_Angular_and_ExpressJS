import { Component, OnInit } from '@angular/core';
import { HomePageReturnService } from '../../Services/home-page-return.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  constructor(private homepageReturnService: HomePageReturnService, activateRoute: ActivatedRoute) {
    // Constructor logic here 
    // Initialization logic here
    this.homepageReturnService.ReturnHomePageData().subscribe((data) => {
      console.log("Data from server", data);
      // Handle the data received from the service
    });
  }

  ngOnInit(): void {
    // Component initialization logic here
  }

  /////////////////

}
