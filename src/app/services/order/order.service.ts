import { HttpClient } from '@angular/common/http';
import { IOrder } from 'src/app/interfaces/order.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseURL: string = '';
  cart: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.baseURL = `http://localhost:8080/api/`;
  }

  getAllOrder(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseURL}getall-order`);
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
