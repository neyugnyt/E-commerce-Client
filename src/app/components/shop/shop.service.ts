import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from 'src/app/libs/shared/models/brand';
import { IPagination, Pagination } from 'src/app/libs/shared/models/pagination';
import { IType } from 'src/app/libs/shared/models/type';
import {map} from 'rxjs/operators'
import { ShopParams } from 'src/app/libs/shared/models/shopParams';
import { IProduct } from 'src/app/libs/shared/models/product';
import { of } from 'rxjs';
import { environment } from 'src/app/libs/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = environment.apiUrl
  products: IProduct[] = []
  brands: IBrand[] = []
  types: IType[] = []
  pagination = new Pagination()
  shopParams = new ShopParams()

  constructor(private http: HttpClient) { }

  getProduct(useCache: boolean){

    if(useCache === false){
      this.products = [];
    }

    if(this.products.length > 0 && useCache === true){
      const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);

      if(this.shopParams.pageNumber <= pagesReceived){
        this.pagination.data = 
          this.products.slice((this.shopParams.pageNumber - 1) * this.shopParams.pageSize, this.shopParams.pageNumber * this.shopParams.pageSize);

          return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if(this.shopParams.brandId !== 0){
      params = params.append('brandId', this.shopParams.brandId.toString());
    }
    if(this.shopParams.typeId !== 0){
      params = params.append('typeId', this.shopParams.typeId.toString());
    }
    if(this.shopParams.search){
      params = params.append('search', this.shopParams.search)
    }
    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageIndex', this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl +'Product', {observe: 'response', params})
      .pipe(
        map(response => {
          this.products = [...this.products, ...response.body.data]
          this.pagination = response.body
          return this.pagination;
        })
      )
  }

  setShopParams(params: ShopParams){
    this.shopParams = params
  }

  getShopParams(){
    return this.shopParams
  }

  getProductById(id: number){
    const product = this.products.find(p => p.id === id)

    if(product){
      return of(product)
    }
    return this.http.get<IProduct>(this.baseUrl + 'Product/' + id)
  }

  getBrands(){
    if(this.brands.length > 0){
      return of(this.brands)
    }

    return this.http.get<IBrand[]>(this.baseUrl + 'Product/brand').pipe(
      map(response => {
        this.brands = response
        return response
      })
    )
  }

  getTypes(){
    if(this.types.length > 0){
      return of(this.types)
    }
    return this.http.get<IType[]>(this.baseUrl + 'Product/type').pipe(
      map(response => {
        this.types = response
        return response
      })
    )
  }
}
