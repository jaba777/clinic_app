import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuardGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let userRole: string | null = null;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      userRole = this.cookieService.get('role');
    }
    const defaultPage = route.routeConfig?.path === 'home';

    if (userRole == 'admin') {
      if (route.routeConfig?.path === 'doctor-register') {
        return true;
      }
    } else {
      this.router.navigate(['/home']);
      return false;
    }

    return defaultPage;
  }
}
