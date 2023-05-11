import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/libs/environments/environment';
import { IDeliveryMethod } from 'src/app/libs/shared/models/deliveryMethod';
import { IOrder, IOrderToCreate } from 'src/app/libs/shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  createOrder(order: IOrderToCreate){
    return this.http.post<IOrder>(this.baseUrl + 'order', order);
  }

  getDeliveryMethods(){
    return this.http.get(this.baseUrl + 'order/deliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
