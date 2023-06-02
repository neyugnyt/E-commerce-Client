import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasketTotals } from 'src/app/libs/shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  basketTotals$: Observable<IBasketTotals>;
  checkoutForm: FormGroup;

  constructor(private basketService: BasketService,private fb: FormBuilder, private accountService: AccountService) {
  }

  ngOnInit(){
    this.createCheckOutForm();
    this.getAddressFormValue();
    this.getDeliveryMethodValue();
    this.basketTotals$ = this.basketService.basketTotal$;
    
  }

  createCheckOutForm(){
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        name: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required]
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFormValue(){
    this.accountService.getUserAddress().subscribe(address =>{
      if(address){
        this.checkoutForm.get('addressForm').patchValue(address);
      }
    }, error =>{
      console.log(error)
    })
  }

  getDeliveryMethodValue(){
    const basket = this.basketService.getCurrentBasket();
    if(basket.deliveryMethodId !== null){
      this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(basket.deliveryMethodId.toString());
    }
  }
}
