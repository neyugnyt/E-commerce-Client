import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from 'src/app/libs/shared/models/basket';
import { BasketService } from '../../basket/basket.service';
import { IUser } from 'src/app/libs/shared/models/user';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  basket$: Observable<IBasket | null>;
  currentUser$: Observable<IUser | null>;
  
  constructor(private accountServer: AccountService, private basketService: BasketService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountServer.currentUser$
  }


  logout(){
    this.accountServer.logout()
  }
}
