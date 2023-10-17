import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements  OnInit {
  authForm : FormGroup ;
  constructor(private auth: AuthService,  private formBuilder: FormBuilder, private router: Router) {
    this.authForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }
  ngOnInit(): void {
    // if (this.isSignedIn()) {
    //   this.goToSchedule()
    // }
  }
  async signIn() {
    await this.auth.signIn(this.authForm.value).then(
      () => {
        console.log(this.auth.isLoggedIn())
      },
      (error) => {
        console.error(error);
      }
    );
  }
  async goToSchedule() {
    this.router.navigate(['schedule']);
  }
  async isSignedIn() {
    return await this.auth.isLoggedIn();
  }
}