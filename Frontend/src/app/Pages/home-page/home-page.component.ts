import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HomePageReturnService } from '../../Services/home-page-return.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, AfterViewInit {
  @ViewChild('mySlides', { static: false }) mySlides!: ElementRef<HTMLTableElement>;
  slideIndex: number = 0; // Declare as a class property
  id: number = 1; // Declare as a class property
  title: string = "Home Page"; // Declare as a class property
  constructor(private homepageReturnService: HomePageReturnService, activateRoute: ActivatedRoute,private renderer: Renderer2) {
    // Constructor logic here 
    // Initialization logic here
    this.homepageReturnService.ReturnHomePageData().subscribe((data) => {
      console.log("Data from server", data);
      // this.showSlides();
      // Handle the data received from the service
    });
  }
  

  ngOnInit(): void {
    // Component initialization logic here
    // this.showSlides(); // Call showSlides() in ngOnInit
    // this.SecondButtonClick();
  }

  ngAfterViewInit(): void {
    this.showSlides(); 
  }
  

  showSlides(){
    console.log("Starting showSlides function...");

    // Get all elements with the class 'mySlides'
    const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    console.log("Slides found:", slides);

    if (slides.length === 0) {
      console.warn("No elements with class 'mySlides' found.");
      return; // Exit if no slides are found
    }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
      console.log(`Hiding slide ${i}`);
      slides[i].style.display = "none";
    }

    // Increment slide index
    this.slideIndex++;
    console.log("Current slide index:", this.slideIndex);

    if (this.slideIndex > slides.length) {
      this.slideIndex = 1; // Reset to the first slide
      console.log("Resetting slide index to 1");
    }
    // Show the current slide
    console.log(`Showing slide ${this.slideIndex - 1}`);
    slides[this.slideIndex - 1].style.display = "block";

    // Call this function again after 2 seconds
    setTimeout(() => this.showSlides(), 2000); // Change image every 2 seconds
  }


  SecondButtonClick() {
    console.log("Second button clicked");
    this.title = "Second Button Clicked";
    // Add your logic here
  }

  FirstButtonClick() {
    alert('Button was clicked!');
    console.log("First button clicked");
    console.log("First button clicked time 1");
    console.log("First button clicked time 2");
    console.log("First button clicked time 3");
    console.log("First button clicked time 4");
    this.SecondButtonClick();
    console.log("First button clicked time 5");
    console.log("First button clicked time 6");
    // Add your logic here
  }

  onButtonClick(): void {
    console.log('Button clicked!');
    alert('Button was clicked!');
  }

//   // Config for Shopping Bag Button - Number 1
// var ShoppingBagButton = document.getElementById("ShoppingBagButton");
// ShoppingBagButton.onclick = function(){
//     document.getElementById("ShoppingBagLink").click();
// }

// // Config for Shopping Bag Button - Number 2
// var PaymentButton = document.getElementById("PaymentButton");
// PaymentButton.onclick = function(){
//     document.getElementById("PaymentLink").click();
// } 

// // Config for Shopping Bag Button - Number 3
// var LoginButton = document.getElementById("User_Account");
// LoginButton.onclick = function(){
//     document.getElementById("LoginLink").click();
// } 
  
}
