import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  titleFooter: string = "Footer chapter"; // Declare as a class property
  SecondButtonClick() {
    console.log("Second button clicked");
    this.titleFooter = "Footer chapter Clicked";
  }
}
