import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { inject } from '@angular/core';
export  const  guardGuard: CanActivateFn = (route,state) => {
  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) {
    inject(Router).navigate(['/signin']);
  }
  return authService.isLoggedIn();
}

