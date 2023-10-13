import { Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {
    console.log(this.auth.currentUser,)
   }
  singIn({email, password}:any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  singOut() {
    return signOut(this.auth);
  }
  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, reject);
    });
  }  
}
