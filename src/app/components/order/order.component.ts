import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/libs/shared/models/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{
  
  orders: IOrder[];
  constructor(private orderService: OrderService){ }
  


  ngOnInit(){
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders().subscribe(res => {
      this.orders = res
      console.log(res)
    })
  }

}
