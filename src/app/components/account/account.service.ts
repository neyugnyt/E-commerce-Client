import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/app/libs/environments/environment';
import { IAddress } from 'src/app/libs/shared/models/address';
import { IUser } from 'src/app/libs/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable()
  
  constructor(private http: HttpClient, private router: Router) { }


  loadCurrentUser(token: string){
    if(token === null){
      this.currentUserSource.next(null!)
      return null
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`)

    return this.http.get<IUser>(this.baseUrl + 'account', {headers})
      .pipe(
        map((user: IUser) =>{
          if(user){
            localStorage.setItem('token', user.token)
            this.currentUserSource.next(user)
          }
        }) 
      )
  }

  login(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/login', values)
      .pipe(
        map((user: IUser) => {
          if(user){
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })
      )
  }

  register(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/register', values)
        .pipe(
          map((user: IUser) => {
          if(user){
            localStorage.setItem('token', user.token)
            this.currentUserSource.next(user)
          }
        }),
        catchError(error => {
        return throwError(() => error);
      })

    )
  }

  logout(){
    localStorage.removeItem('token')
    this.currentUserSource.next(null as any)
    this.router.navigateByUrl('/')
  }

  checkEmailExist(email: string){
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress(){
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress){
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
}
