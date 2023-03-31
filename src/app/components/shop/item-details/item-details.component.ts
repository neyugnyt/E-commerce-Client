import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/libs/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../../basket/basket.service';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit{
  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService,
     private activateRouter: ActivatedRoute,
     private bcService: BreadcrumbService,
     private basketService: BasketService
     ) {
      this.bcService.set('@itemDetails', '')
     }

  ngOnInit(){
    this.loadProduct();
  }
  
  loadProduct(){
    this.shopService.getProductById(+Number(this.activateRouter.snapshot.paramMap.get('id'))).subscribe(
      product =>{
        this.product = product
        this.bcService.set('@itemDetails', product.name);
      }, error =>{
        console.log(error)
      }
    )
  }
  addItemToBasket(){
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity(){
    this.quantity++;
  }
  decrementQuantity(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }
}
