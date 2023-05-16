import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from 'src/app/libs/shared/shared.module';
import { OrderComponent } from './order.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';


@NgModule({
  declarations: [OrderComponent, OrderDetailedComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrderModule { }
