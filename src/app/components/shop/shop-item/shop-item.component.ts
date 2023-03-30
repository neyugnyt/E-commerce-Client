import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/libs/shared/models/product';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss']
})
export class ShopItemComponent implements OnInit{

  @Input() product: IProduct;
  constructor(private basketService: BasketService) {
    
  }

  ngOnInit() {
    
  }

  addItemToBasket(){
    this.basketService.addItemToBasket(this.product);
  }

}
