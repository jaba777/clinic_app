import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class UserGuardGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let userToken: string | null = null;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      userToken = this.cookieService.get('token');
    }

    if (userToken) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
