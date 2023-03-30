import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BasketService } from './components/basket/basket.service';
import { IPagination } from './libs/shared/models/pagination';
import { IProduct } from './libs/shared/models/product';
import { ulities } from './libs/shared/tailwind-magika';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'E-commerce.Client';
  
  uliti = ulities;
  constructor(private basketService: BasketService) {
   
  }
  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if(basketId){
      this.basketService.getBasket(basketId).subscribe(() => {
        console.log('init basket');
      }, error => {
        console.log(error);
      });
    }
  }
}
