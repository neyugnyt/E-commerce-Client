import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop/shop.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { SharedModule } from 'src/app/libs/shared/shared.module';



@NgModule({
  declarations: [ShopComponent, ShopItemComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ShopComponent]
})
export class ShopModule { }
