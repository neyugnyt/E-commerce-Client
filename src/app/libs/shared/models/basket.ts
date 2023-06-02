import {v4 as uuid} from 'uuid';

export interface IBasket {
    id: string;
    items: IBasketItem[];
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
}
  
export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    brand: string;
    type: string;
    pictureUrl: string;
}

export class Basket implements IBasket{
    id = uuid();
    items: IBasketItem[] = [];
}

export interface IBasketTotals{
    shipping: number;
    subtotal: any;
    total: number;
}