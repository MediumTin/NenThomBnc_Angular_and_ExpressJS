import { Component } from '@angular/core';
import { IndentificationService } from '../../../Services/IdentificationService/indentification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  Identified_Current_User : string = "";
  showClickedMessage = false;

  constructor(private identification: IndentificationService) {
      const sessionInfo = this.identification.GetSessionID();
      this.Identified_Current_User = sessionInfo.Username;
      console.log("Got SessionID is: ",`${sessionInfo.SessionID}`, "Got Username is: ",`${sessionInfo.Username}`);	
  }
}
