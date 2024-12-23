
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Basket, BasketItem, BasketTotals } from '../shared/models/Basket';
import { Product } from '../shared/models/Product';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();

  private basketTotalSource=new BehaviorSubject<BasketTotals|null>(null);
  basketTotalSource$=this.basketTotalSource.asObservable();



  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  setShippingPrice(deliveryMethod:DeliveryMethod)
  {
    const basket= this.getCurrentBsketValue();

    if(basket)
    {
      basket.shippingPrice=deliveryMethod.price;
      console.log("shipping price is ",deliveryMethod)
      basket.deliveryMethodId=deliveryMethod.id;
      this.setBasket(basket);
    }
    this.calculateTotals();
  }

  createPaymentIntent()
  {
    return this.http.post<Basket>(this.baseUrl +'payments/'+this.getCurrentBsketValue()?.id,{})
    .pipe(
      map((basket: Basket | null)=>{
        this.basketSource.next(basket);
      })
    )
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  getCurrentBsketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product |BasketItem, quantity = 1) {
    if(this.isProduct(item)) item=this.mapProductItemToBasketItem(item)
    const basket = this.getCurrentBsketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  removeItemFromBasket(id:number,quantity=1)
  {
    const basket= this.getCurrentBsketValue();
    if(!basket) return;
    const item= basket.items.find(x=>x.id===id);
    if(item)
    {
      item.quantity-=quantity;
      if(item.quantity===0)
      {
        basket.items=basket.items.filter(x=>x.id!==id);
      }
      if(basket.items.length>0)this.setBasket(basket);
      else
      this.deleteBasket(basket);
    }
  }

  deleteBasket(basket:Basket)
  {
    return this.http.delete(this.baseUrl+'basket?id='+basket.id).subscribe({
      next:()=>{
       this.deleteLocalBasket();
      }
    })
  }

  deleteLocalBasket()
  {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem("basket_id");
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x => x.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }
  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem("basket_Id", basket.id);
    return basket;
  }
  private mapProductItemToBasketItem(item: Product) {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calculateTotals()
  {
    const basket =this.getCurrentBsketValue();
    console.log("basket is ")
    console.log(basket)
    if(!basket) return;
    const subtotal= basket.items.reduce((a,b)=>(b.price*b.quantity)+a,0);
    const total=subtotal+basket.shippingPrice;
    this.basketTotalSource.next({shipping:basket.shippingPrice,total,subtotal});
  }

  private isProduct(item:Product|BasketItem) :item is Product
  {
   return (item as Product).productBrand!==undefined
  }

}
