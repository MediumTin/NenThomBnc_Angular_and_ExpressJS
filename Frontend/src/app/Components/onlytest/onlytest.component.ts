import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onlytest',
  imports: [],
  templateUrl: './onlytest.component.html',
  styleUrl: './onlytest.component.css'
})
export class OnlytestComponent {
  constructor(private router:Router)
  { }
  testvariable: string = 'This is a test variable';
  ButtonEvent() {
    console.log("Button clicked in OnlytestComponent");
    this.testvariable = "Button was clicked!";
  }
  ButtonDirection() {
    console.log("Button clicked in OnlytestComponent");
    // this.testvariable = "Button was clicked!";
    this.router.navigate(['/onlytest2']); // Navigate to login handling page internal in Angular
    // Add your logic here
  }

}
