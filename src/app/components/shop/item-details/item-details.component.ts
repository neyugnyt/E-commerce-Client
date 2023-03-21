import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/libs/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit{
  product: IProduct;

  constructor(private shopService: ShopService, private activateRouter: ActivatedRoute) {}

  ngOnInit(){
    this.loadProduct();
  }
  
  loadProduct(){
    this.shopService.getProductById(+Number(this.activateRouter.snapshot.paramMap.get('id'))).subscribe(
      product =>{
        this.product = product
      }, error =>{
        console.log(error)
      }
    )
  }

}
