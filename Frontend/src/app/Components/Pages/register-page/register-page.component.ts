import { Component, OnInit } from '@angular/core';
import { IUserRegister } from '../../../Common_Configuration/interfaces/IUserRegister';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../Services/user/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TitleComponent } from "../../Partials/title/title.component";
import { TextInputComponent } from "../../Partials/text-input/text-input.component";
import { DefaultButtonComponent } from "../../Partials/default-button/default-button.component";

@Component({
  selector: 'app-register-page',
  imports: [TitleComponent, TextInputComponent, ReactiveFormsModule, DefaultButtonComponent, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {

  registerForm!:FormGroup;
  isSubmitted = false;

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]]
    },{
      validators: PasswordsMatchValidator('password','confirmPassword')
    });

    this.returnUrl= this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;

    const fv= this.registerForm.value;
    const user :IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }

}
function PasswordsMatchValidator(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}

