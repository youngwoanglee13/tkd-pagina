import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) { }
  async signOut() {
    this.authService.signOut();
    await this.authService.signOut().then(
      () => {
        this.goToSignIn();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  goToSignIn() {
    this.router.navigate(['signin']);
  }
}
