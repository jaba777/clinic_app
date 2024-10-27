import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  SignUp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/sign-up`, data);
  }

  DoctorSignUp(data: any, userId: number | string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/Auth/sign-up-doctor?userId=${userId}`,
      data
    );
  }

  SignIn(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/sign-in`, data);
  }
}
