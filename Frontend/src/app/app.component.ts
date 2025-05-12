import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
export class AppComponent {
  title = 'Frontend';
  isUserIdentifiedMain: boolean = false;
  isUserIdentified: UserInformation[] = [];
  isUserIdentifiedObservable: Observable<UserInformation[]>;

  constructor(private activatedRoute: ActivatedRoute, private identification: IndentificationService) { 
    this.isUserIdentifiedObservable = this.identification.CheckIdentification();
    this.isUserIdentifiedObservable.subscribe((UserInfo) => {
      this.isUserIdentified = UserInfo;
      console.log("UserInfo is ", this.isUserIdentified[0]?.Currentuser);
      // Check if the user is identified
      if (this.isUserIdentified[0]?.Currentuser != "No User") {
        this.isUserIdentifiedMain = true;
        console.log("User has identified yet");
      } else {
        // User is not identified, handle accordingly - request login
        this.isUserIdentifiedMain = false;
        console.log("User has not identified yet");
        this.identification.RequestUserLogin();
      }
    });
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
}


