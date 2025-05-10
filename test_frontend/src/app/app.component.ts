import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  standalone: true, // Mark the component as standalone
  imports: [TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
FirstButtonClick() {
  console.log("First button clicked");
}
  title = 'test_frontend';
}
