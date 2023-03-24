import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: ':id', component: ItemDetailsComponent, data: {breadcrumb: {alias: 'itemDetails'}}},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class ShopRoutingModule { }
