import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from 'src/app/libs/shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:7267/api/'

  constructor(private http: HttpClient) { }

  getProduct(){
    return this.http.get<IPagination>(this.baseUrl +'Product?PageIndex=1&PageSize=50')
  }
}
