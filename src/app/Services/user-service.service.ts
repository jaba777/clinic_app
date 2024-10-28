import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  userId: any = null;

  MyProfile(userId: any): Observable<any> {
    if (userId) {
      return this.http.get(
        `${this.baseUrl}/api/Users/my-profile?userId=${userId}`
      );
    }
    return of(null);
  }

  FindDoctors(categoryId: number | null, page: number): Observable<any> {
    if (categoryId && page) {
      return this.http.get(
        `${this.baseUrl}/api/Users/get-doctors?categoryId=${categoryId}&page=${page}`
      );
    }
    return of(null);
  }
}
