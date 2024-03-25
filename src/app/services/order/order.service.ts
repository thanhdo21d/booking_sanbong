import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IOrder } from 'src/app/interfaces/order.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseURL: string = '';
  cart: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.baseURL = environment.API_URL;
  }
  getAccessToken() {
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || '');

    if (!accessToken || accessToken === '') {
      this.router.navigate(['/login-admin']);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const options = { headers: headers };
    return options;
  }
  getAllOrder(): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/api/Booking/History`, {});
  }
  getIdOrder(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}getId-order/${id}`);
  }
  orderBuy(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}add-to-buyed/${id}`, data);
  }

  updateOrder(id: string, status: string): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.baseURL}update-status-buyed/${id}`, {
      status: status,
    });
  }
}
