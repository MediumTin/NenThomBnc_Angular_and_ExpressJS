import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./Pages/footer/footer.component";
import { HeaderComponent } from "./Pages/header/header.component";
import { TestComponent } from "./test/test.component";
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { Test2Component } from "./test2/test2.component";
import { LoginAndRegisterComponent } from "./Pages/Login_and_Register/login-and-register/login-and-register.component";
import { CommonModule } from '@angular/common';
import { IndentificationService } from './Services/IdentificationService/indentification.service';
import { Observable } from 'rxjs';
import { UserInformation } from './Common_Configuration/Models/UserInformation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, TestComponent, Test2Component, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  isUserIdentifiedMain: boolean = false;
  isUserIdentified: UserInformation[] = [];

  constructor(private router:Router, private activatedRoute: ActivatedRoute, private identification: IndentificationService) { 
    const sessionInfo = this.identification.GetSessionID();
    if (sessionInfo.Username != "") {
      // this.isUserIdentifiedMain = true;
      this.identification.SetisUserIdentifiedMain(true);
      console.log("User has identified yet");
    } else {
      // User is not identified, handle accordingly - request login
      // this.isUserIdentifiedMain = false;
      this.identification.SetisUserIdentifiedMain(false);
      console.log("User has not identified yet");
      this.router.navigate(['/login_handling']);
      
    }
  }

  toggleHeaderVisibility() {
    this.isUserIdentifiedMain = !this.isUserIdentifiedMain; // Toggle visibility
    console.log("Header visibility toggled:", this.isUserIdentifiedMain);
  }

  SecondButtonClick(): void {
    console.log("Second button clicked");
    this.title = "Second Button Clicked";
    // Add your logic here
  }
  ngOnInit(){
  this.identification.isUserIdentifiedMain.subscribe(val => {
    this.isUserIdentifiedMain = val;
  });
}


}


