import { Component } from '@angular/core';
import { Test2Component } from '../test2/test2.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [Test2Component],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
SecondButtonClick() {
  console.log("Second button in test component clicked");
}

}
