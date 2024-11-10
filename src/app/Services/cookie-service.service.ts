import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UserServiceService } from '../Services/user-service.service';
interface User {
  name: string;
  userId: number | null;
}
@Injectable({
  providedIn: 'root',
})
export class CookieServiceService implements OnInit {
  user: User = {
    name: '',
    userId: null,
  };
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private userServiceService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.user = {
      name: JSON.parse(this.cookieService.get('name')),
      userId: JSON.parse(this.cookieService.get('userId')),
    };
  }
  setCookie(name: string, value: any): void {
    this.cookieService.set(name, value);
  }
  getCookie(name: string) {
    return this.cookieService.get(name);
  }
  removeCookieAll(): void {
    this.user = {
      name: '',
      userId: null,
    };

    this.cookieService.deleteAll();
    this.userServiceService.myUser = {};
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 50);
  }
}
