import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments';

@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  FindCategory(search: string, page: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/Categories/find-category?search=${search}&page=${page}`
    );
  }

  AllCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Categories/all-categories`);
  }
}
