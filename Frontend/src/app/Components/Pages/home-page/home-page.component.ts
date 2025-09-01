import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HomePageReturnService } from '../../../Services/HomePageService/home-page-return.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInformation } from '../../../Common_Configuration/Models/UserInformation';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';

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
  userInformation: UserInformation[] = [];
  intervalId: any;

  constructor(private router:Router,private homepageReturnService: HomePageReturnService, activateRoute: ActivatedRoute,private renderer: Renderer2, private identification: IndentificationService) {
      console.log("User has identified yet");

      // Scenario 1: If want user can access the website without login


      // Scenario 2: If want user must login before access the website
      // this.homepageReturnService.ReturnHomePageData().subscribe((data) => {
      //   this.userInformation = data; // Assign the final data to the component property
      //   console.log("Data from server", data);
      //   if(this.userInformation[0].status == "Session is timeout"){
      //     console.log("Session is timeout"); 
      //     this.identification.ClearSessionStorage();
      //     this.identification.SetisUserIdentifiedMain(false);
      //     this.router.navigate(['/login_handling']);  // Navigate to login handling page internal in Angular
      //   }  
      //   else {
      //     // status is "Session is normal"
      //   }
      // });
  }
  

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.showSlides(); // Hiển thị slide đầu tiên ngay lập tức
    this.intervalId = setInterval(() => this.showSlides(), 5000);
  }
  

  showSlides() {
    const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    if (slides.length === 0) return;

    // Ẩn tất cả slide
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    // Tăng chỉ số slide
    this.slideIndex++;
    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    // Hiển thị slide hiện tại
    slides[this.slideIndex - 1].style.display = "block";
  }


  onButtonClick(): void {
    console.log('Button clicked!');
    alert('Button was clicked!');
  }
  
}
