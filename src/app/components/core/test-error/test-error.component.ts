import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/libs/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit{

  baseUrl = environment.apiUrl;
  
  /**
   *
   */
  constructor(private http: HttpClient) {  }
  ngOnInit(){

  }
  
  get404Error(){
    this.http.get(this.baseUrl + 'ErrorHandling/notfound').subscribe(response =>{
      console.log(response);
    }, error =>{
      console.log(error)
    })
  }
  get500Error(){
    this.http.get(this.baseUrl + 'ErrorHandling/servererror').subscribe(response =>{
      console.log(response);
    }, error =>{
      console.log(error)
    })
  }
  getBadRequestError(){
    this.http.get(this.baseUrl + 'ErrorHandling/badrequest').subscribe(response =>{
      console.log(response);
    }, error =>{
      console.log(error)
    })
  }


}
