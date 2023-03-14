import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'E-commerce.Client';
  products: IProduct[];

  constructor(private http: HttpClient) {
   
  }
  ngOnInit(): void {
    this.http.get('https://localhost:7267/api/Product?PageIndex=1&PageSize=50&Sort=name').subscribe(
    (response: any) => {
      this.products = response.data;
    }, error => {
      console.log(error)
    });
  }
}
