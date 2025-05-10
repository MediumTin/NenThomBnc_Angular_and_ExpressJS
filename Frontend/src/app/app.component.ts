import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./Pages/footer/footer.component";
import { HeaderComponent } from "./Pages/header/header.component";
import { TestComponent } from "./test/test.component";
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { Test2Component } from "./test2/test2.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, TestComponent, Test2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
  SecondButtonClick() : void {
    console.log("Second button clicked");
    this.title = "Second Button Clicked";
    // Add your logic here
  }
  
}
