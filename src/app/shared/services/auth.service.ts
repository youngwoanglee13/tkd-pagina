import { Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {
    console.log(this.auth.currentUser,)
   }
  signIn({email, password}:any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  signOut() {
    console.log("SALIO",this.auth.currentUser)
    return signOut(this.auth);
  }
  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        
        
        if (user) {
          console.log("LOGEADO")
          resolve(true);
        } else {
          console.log("NO -- LOGEADO")
          resolve(false);
        }
      }, reject);
      unsubscribe();
    });
  }  
}
