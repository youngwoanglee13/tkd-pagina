import { Injectable, inject } from '@angular/core';
import {Auth,onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: User | null = null;
  constructor(private auth :Auth) {
    onAuthStateChanged(auth, user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        this.userData = null;
        localStorage.setItem('user', 'null');
      }
    });
  }
  async signIn({email, password}:any) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }
  async signOut() {
    return await signOut(this.auth).then(() => {
      localStorage.removeItem('user');
    });
  }
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }
}
