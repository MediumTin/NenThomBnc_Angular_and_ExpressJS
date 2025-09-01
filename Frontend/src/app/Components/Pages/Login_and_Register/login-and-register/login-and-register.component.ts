import { Component, OnInit } from '@angular/core';
import { IndentificationService } from '../../../../Services/IdentificationService/indentification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInformation } from '../../../../Common_Configuration/Models/UserInformation';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // <-- Correct import

@Component({
  selector: 'app-login-and-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-and-register.component.html',
  styleUrl: './login-and-register.component.css'
})
export class LoginAndRegisterComponent implements OnInit {
  isUserIdentified : UserInformation[] =[];
  constructor(private identification: IndentificationService, private router:Router) {
  }
  RegisterUser(formValue: { username: string; email : string, password: string; confirm_password: string; }) {
    // const user = { username: 'Nguyen Van Tam', password: '09004092001' };
    // this.identification.RequestUserRegister(user);
    // const sessionInfo = this.identification.GetSessionID();
    // console.log("Got SessionID is: ",`${sessionInfo.SessionID}`, "Got Username is: ",`${sessionInfo.Username}`);	
    const userRegister = {
      username: formValue.username,
      email : formValue.email,
      password: formValue.password,
      confirm_password: formValue.confirm_password
    };

    let isUserRegister : Observable<UserInformation[]>;
    isUserRegister = this.identification.RequestUserRegister(userRegister);
    isUserRegister.subscribe((UserInfo) => {
      this.isUserIdentified = UserInfo;
      console.log("UserInfo is ", this.isUserIdentified[0]?.Currentuser);
      // console.log("UserInfo is ", this.isUserIdentified[0]?.SessionID); // server does not return session ID to client for security reason
      if(this.isUserIdentified[0]?.Currentuser != undefined){
        // In case of successful login
        // Redirect the user to the home page
        this.identification.SetSessionID(this.isUserIdentified[0]?.Currentuser ?? "",this.isUserIdentified[0]?.isAdminRights ?? false  );
        this.identification.SetisUserIdentifiedMain(true);
        this.router.navigate(['']);
      }
      else {
        // In case of unsuccessful login
        // Allert the user
        window.alert('Incorrect username or password for register sucessfully!');
      }
    });
  }
  LoginUser(formValue: { username: string; password: string; remember: boolean }) {
    // Get the username and password from the form
    const user = {
      username: formValue.username,
      password: formValue.password
    };

    let isUserLogin : Observable<UserInformation[]>;
    isUserLogin = this.identification.RequestUserLogin(user);
    isUserLogin.subscribe((UserInfo) => {
      this.isUserIdentified = UserInfo;
      console.log("UserInfo is ", this.isUserIdentified[0]?.Currentuser);
      // console.log("UserInfo is ", this.isUserIdentified[0]?.SessionID); // server does not return session ID to client for security reason
      if(this.isUserIdentified[0]?.Currentuser != undefined){
        // In case of successful login
        // Redirect the user to the home page
        this.identification.SetSessionID(this.isUserIdentified[0]?.Currentuser ?? "",this.isUserIdentified[0]?.isAdminRights ?? false );
        this.identification.SetisUserIdentifiedMain(true);
        if(this.isUserIdentified[0]?.isAdminRights == true){
          this.identification.SetisAdminAccepted(true);
        }
        else {
          this.identification.SetisAdminAccepted(false);
        }
        this.router.navigate(['']);
      }
      else {
        // In case of unsuccessful login
        // Allert the user
        window.alert('Incorrect username or password!');
      }
      
    });
  }

  ngOnInit(): void {  
  }


}
