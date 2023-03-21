import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from 'src/app/libs/shared/models/brand';
import { IPagination } from 'src/app/libs/shared/models/pagination';
import { IType } from 'src/app/libs/shared/models/type';
import {map} from 'rxjs/operators'
import { ShopParams } from 'src/app/libs/shared/models/shopParams';
import { IProduct } from 'src/app/libs/shared/models/product';
@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:7267/api/'

  constructor(private http: HttpClient) { }

  getProduct(shopParams: ShopParams){

    let params = new HttpParams();

    if(shopParams.brandId !== 0){
      params = params.append('brandId', shopParams.brandId.toString());
    }
    if(shopParams.typeId !== 0){
      params = params.append('typeId', shopParams.typeId.toString());
    }
    if(shopParams.search){
      params = params.append('search', shopParams.search)
    }
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageIndex', shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl +'Product', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      )
  }

  getProductById(id: number){
    return this.http.get<IProduct>(this.baseUrl + 'Product/' + id)
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'Product/brand')
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'Product/type')
  }
}
