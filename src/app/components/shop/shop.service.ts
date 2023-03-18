import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from 'src/app/libs/shared/models/brand';
import { IPagination } from 'src/app/libs/shared/models/pagination';
import { IType } from 'src/app/libs/shared/models/type';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:7267/api/'

  constructor(private http: HttpClient) { }

  getProduct(){
    return this.http.get<IPagination>(this.baseUrl +'Product?PageIndex=1&PageSize=50')
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'Product/brand')
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'Product/type')
  }
}
