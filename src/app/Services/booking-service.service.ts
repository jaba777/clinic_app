import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments';

@Injectable({
  providedIn: 'root',
})
export class BookingServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  AddBooking(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Booking/add-booking`, data);
  }

  GetBooks(
    startDate: string,
    endDate: string,
    doctorId: number
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/Booking/get-books?startDate=${startDate}&endDate=${endDate}&doctorId=${doctorId}`
    );
  }
  RemoveBook(bookId: any, userId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/api/Booking/remove-book/${bookId}?userId=${userId}`
    );
  }
}
