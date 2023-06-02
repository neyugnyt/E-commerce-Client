import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { FormGroup } from '@angular/forms';
import { IAddress } from 'src/app/libs/shared/models/address';
import { IBasket } from 'src/app/libs/shared/models/basket';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy{

  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement: ElementRef
  @ViewChild('cardExpiry') cardExpiryElement: ElementRef
  @ViewChild('cardCvc') cardCvcElement: ElementRef
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardCvc?: StripeCardCvcElement;
  cardExpiry?: StripeCardExpiryElement;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any
  cardHandler = this.onChange.bind(this);
  loading = false;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, 
    private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    loadStripe('pk_test_51NAfzHEQHmLHzWvNT8hOWWlrXdA4XnO8d8bL3EIFKeVYbNUejHeLjo4PAwLu4fHV5YryNlUx33Ixsp5cXL2u5DvP00phk0PBhN').then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', event => {
          this.cardNumberComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', event => {
          this.cardExpiryComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', event => {
          this.cardCvcComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })
      }
    })
  }
  get paymentFormComplete() {
    return this.checkoutForm?.get('paymentForm')?.valid 
      && this.cardNumberComplete 
      && this.cardExpiryComplete 
      && this.cardCvcComplete
  }
  ngOnDestroy(){
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();

  }

  onChange({error}){
    if(error){
      this.cardErrors = error.message
    }
    else{
      this.cardErrors = null
    }
  }
  async submitOrder() {
      this.loading = true;
      const basket = this.basketService.getCurrentBasket();
      if (!basket) throw new Error('cannot get basket');

      try{
        const createdOrder  = await this.createOrder(basket);
        const paymentResult = await this.confirmPaymentWithStripe(basket)
        if(paymentResult.paymentIntent){
          this.toastr.success('Order created successfully');
          this.basketService.deleteBasket(basket);
          const navigationExtras: NavigationExtras = {state: createdOrder};
          this.router.navigate(['checkout/success'], navigationExtras);
        }
        else{
          this.toastr.error(paymentResult.error.message)
        }
      }
      catch(error: any){
        console.log(error);
        this.toastr.error(error.message)
      }
      finally{
        this.loading = false;
      }
    }

    private async confirmPaymentWithStripe(basket: IBasket | null) {
      if (!basket) throw new Error('Basket is null');
      const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
        payment_method: {
          card: this.cardNumber!,
          billing_details: {
            name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
          }
        }
      });
      if (!result) throw new Error('Problem attempting payment with stripe');
      return result;
    }
    private async createOrder(basket: IBasket | null) {
      if (!basket) throw new Error('Basket is null');
      const orderToCreate = this.getOrderToCreate(basket);
      return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
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
