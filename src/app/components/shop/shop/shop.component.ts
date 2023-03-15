import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/libs/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: IProduct[];
  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.shopService.getProduct().subscribe(response => {
      this.products = response.data
    }, error =>{
      console.log(error);
    });
  }



}
