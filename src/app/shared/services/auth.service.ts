import { Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }
  singIn({email, password}:any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  singOut() {
    return signOut(this.auth);
  }
  isLoggedIn() {
    return this.auth.currentUser ? true : false;
  }
}
