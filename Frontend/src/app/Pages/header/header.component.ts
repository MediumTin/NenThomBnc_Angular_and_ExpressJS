import { Component } from '@angular/core';
import { IndentificationService } from '../../Services/IdentificationService/indentification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  Identified_Current_User : string = "";
  constructor(private identification: IndentificationService) {
      const sessionInfo = this.identification.GetSessionID();
      this.Identified_Current_User = sessionInfo.Username;
      console.log("Got SessionID is: ",`${sessionInfo.SessionID}`, "Got Username is: ",`${sessionInfo.Username}`);	
  }


}
