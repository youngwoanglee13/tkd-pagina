import { Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }
  login({email, password}:any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout() {
    return signOut(this.auth);
  }
  isSignedIn() {
    return this.auth.currentUser ? true : false;
  }
}
