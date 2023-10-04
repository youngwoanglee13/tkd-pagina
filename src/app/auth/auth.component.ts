import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm : FormGroup ;
  constructor(private auth: AuthService,  private formBuilder: FormBuilder) {
    this.authForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }
  login() {
    // console.log(this.auth.login(this.authForm.value))
    this.auth.login(this.authForm.value).then((res:any)=>{
      console.log(res)
    }).catch((err:any)=>{
      console.log(err)
    })
  }
}
