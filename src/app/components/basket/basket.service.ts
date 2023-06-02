import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { environment } from 'src/app/libs/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from 'src/app/libs/shared/models/basket';
import { map} from 'rxjs/operators';
import { IProduct } from 'src/app/libs/shared/models/product';
import { IDeliveryMethod } from 'src/app/libs/shared/models/deliveryMethod';
@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) { }

  createPaymentIntent(){
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasket().id, {})
        .pipe(
          map((basket: IBasket) =>{
            this.basketSource.next(basket);
            console.log(this.getCurrentBasket());
          })
        );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price
    const basket = this.getCurrentBasket();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotal();
    this.setBasket(basket);
  }


  getBasket(id: string){
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
            .pipe(
              map((basket: IBasket) => {
                this.basketSource.next(basket);
                this.shipping = basket.shippingPrice;
                this.calculateTotal();
              })
            )
  }

  setBasket(basket: IBasket){
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket)
            .subscribe((res: IBasket) =>{
              this.basketSource.next(res)
              this.calculateTotal();
            },error =>{
              console.log(error);
            });
  }

  getCurrentBasket(){
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct | IBasketItem, quantity = 1){
    if(this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    console.log(item);
    const basket = this.getCurrentBasket() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasket();
    if(!basket) return;

    const item = basket.items.find(x => x.id == id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0){
        basket.items = basket.items.filter(x => x.id !== id)
      }
      if(basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket)
    }

  }
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.deleteLocalBasket();
      }
    })
  }

  deleteLocalBasket(){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else{
      items[index].quantity += quantity;
    }
    return items;
  }
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;

  }
  private calculateTotal(){
    const basket = this.getCurrentBasket();
    const shipping = this.shipping;
    const subtotal = basket!.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total =  subtotal! + shipping;
    this.basketTotalSource.next({shipping, total, subtotal})

  }
  private mapProductItemToBasketItem(item: IProduct): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity: 0,
      brand: item.productBrand,
      type: item.productType
    }
  }
  private isProduct(item: IProduct | IBasketItem): item is IProduct {
    return (item as IProduct).productBrand !== undefined;
  }

}
