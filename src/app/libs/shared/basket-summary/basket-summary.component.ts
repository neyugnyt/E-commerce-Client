import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IBasket, IBasketItem } from '../models/basket';
import { BasketService } from 'src/app/components/basket/basket.service';
import { IOrderItem } from '../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit{
  
  basket$: Observable<IBasket>;
  @Output() addItem = new EventEmitter<IBasketItem>();
  @Output() removeItem = new EventEmitter<{id: number, quantity: number}>();
  @Input() isBasket = true;
  @Input() items: IBasketItem[] | IOrderItem[] = [];
  @Input() isOrder = false;



  constructor(public  basketService: BasketService) {
  }

  
  ngOnInit(){
    this.basket$ = this.basketService.basket$;
  }

  addBasketItem(item: IBasketItem) {
    this.addItem.emit(item)
  }

  removeBasketItem(id: number, quantity = 1) {
    this.removeItem.emit({id, quantity})
  }


}
