import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { IOrder } from 'src/app/libs/shared/models/order';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  
  order: IOrder;
  
  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService, private orderService: OrderService){
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  ngOnInit() {
    this.getOrderById();
  }


  getOrderById(){
    this.orderService.getOrderById(+this.route.snapshot.paramMap.get('id')).subscribe((order: IOrder) => {
      this.order = order
      
      this.breadcrumbService.set('@OrderDetailed', `Order#${order.id} - ${order.status}`);
    }, error =>{
      console.log(error)
    })
  }
}
