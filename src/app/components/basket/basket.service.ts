import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { environment } from 'src/app/libs/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from 'src/app/libs/shared/models/basket';
import { map} from 'rxjs/operators';
import { IProduct } from 'src/app/libs/shared/models/product';
@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();


  constructor(private http: HttpClient) { }


  getBasket(id: string){
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
            .pipe(
              map((basket: IBasket) => {
                this.basketSource.next(basket);
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

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasket() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
    basket!.items[foundItemIndex!].quantity++;
    this.setBasket(basket!);
  }

  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
    if(basket!.items[foundItemIndex!].quantity > 1){
      basket!.items[foundItemIndex!].quantity--;
      this.setBasket(basket!);
    }else{
      this.removeItemFromBasket(item);
    }
    
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    if(basket!.items.some(x => x.id === item.id)){
      basket!.items = basket!.items.filter(i => i.id !== item.id);
      if(basket!.items.length > 0){
        this.setBasket(basket!);
      }else{
        this.deleteBasket(basket!)
      }
    }
  }
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() =>{
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error =>{
      console.log(error);
    })
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
    const shipping = 0;
    const subtotal = basket!.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total =  subtotal! + shipping;
    this.basketTotalSource.next({shipping, total, subtotal})

  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

}
