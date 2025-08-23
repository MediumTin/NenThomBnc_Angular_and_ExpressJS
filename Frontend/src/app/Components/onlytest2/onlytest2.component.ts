import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onlytest2',
  imports: [],
  templateUrl: './onlytest2.component.html',
  styleUrl: './onlytest2.component.css'
})
export class Onlytest2Component {
  constructor(private router:Router)
  { }

  ButtonDirection2() {
    console.log("Button clicked in OnlytestComponent");
    // this.testvariable = "Button was clicked!";
    this.router.navigate(['/onlytest']);  // Navigate to login handling page internal in Angular
    // Add your logic here
  }
}
