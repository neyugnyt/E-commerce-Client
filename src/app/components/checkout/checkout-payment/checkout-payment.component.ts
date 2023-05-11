import { Component, Input } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { FormGroup } from '@angular/forms';
import { IAddress } from 'src/app/libs/shared/models/address';
import { IBasket } from 'src/app/libs/shared/models/basket';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {

  @Input() checkoutForm?: FormGroup;
  
  constructor(private basketService: BasketService, private checkoutService: CheckoutService, 
    private toastr: ToastrService, private router: Router) {}

    submitOrder() {
      const basket = this.basketService.getCurrentBasket();
      if (!basket) return;
      const orderToCreate = this.getOrderToCreate(basket);
      if (!orderToCreate) return;
      this.checkoutService.createOrder(orderToCreate).subscribe({
        next: order => {
          this.toastr.success('Order created successfully');
          console.log(order)
          this.basketService.deleteLocalBasket();
          const navigationExtras: NavigationExtras = {state: order};
          this.router.navigate(['checkout/success'], navigationExtras);
        }
      })
    }

    private getOrderToCreate(basket: IBasket) {
      const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
      const shipToAddress = this.checkoutForm?.get('addressForm')?.value as IAddress;
      if (!deliveryMethodId || !shipToAddress){
        return null;
      }
      return {
        basketId: basket.id,
        deliveryMethodId: deliveryMethodId,
        shipToAddress: shipToAddress
      }
    }
}
