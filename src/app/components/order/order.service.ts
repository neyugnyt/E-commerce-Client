import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/libs/environments/environment';
import { IOrder } from 'src/app/libs/shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getOrders(){
    return this.http.get<IOrder[]>(this.baseUrl + 'order')
  }


  getOrderById(id: number){
    return this.http.get<IOrder>(this.baseUrl + 'order/' + id)
  }
}
