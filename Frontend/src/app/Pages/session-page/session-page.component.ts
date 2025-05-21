import { Component } from '@angular/core';
import { SessionHandlingService } from '../../Services/SessionService/session-handling.service';

@Component({
  selector: 'app-session-page',
  imports: [],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.css'
})
export class SessionPageComponent {
  constructor(private sessionService: SessionHandlingService) { 
    // Constructor logic here
    console.log("SessionPageComponent initialized");
    this.sessionService.GetSessionID();
  }

}
