import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{


  constructor(private accountService: AccountService, private router: Router) {
  
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : Observable<boolean>{
    return this.accountService.currentUser$.pipe(
        map(auth => {
          if(auth) {
            return true
          }
          this.router.navigate(['account/login'], {queryParams : {returnUrl: state.url}})
          return false
        })
      )
    }
}
