import {v4 as uuid} from 'uuid';

export interface IBasket {
    id: string;
    items: IBasketItem[];
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
    items: IBasketItem[];
}