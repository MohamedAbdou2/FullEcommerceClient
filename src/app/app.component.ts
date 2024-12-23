import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { Product } from './shared/models/Product';
import { Pagination } from './shared/models/Pagination';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // title = 'Store Application';

  constructor(private http:HttpClient,private basketService:BasketService,private accountService:AccountService) {

  }
 products: Product[] = [];

 ngOnInit(): void {
   this.http.get<Pagination<Product[]>>('https://localhost:7125/api/product?pageSize=50').subscribe({
     next: response => this.products = response.data,
     error: error => console.log(error),
     complete: () => {
       console.log('request completed');
       console.log('extra statment');
     }
   })
   const basketId= localStorage.getItem("basket_Id");
   if(basketId) this.basketService.getBasket(basketId);
   this.loadCurrentUser();
 }
 title = 'Shopping';

 loadCurrentUser()
 {
   const token= localStorage.getItem('token');
   this.accountService.loadCurrentUser(token).subscribe();
 }
}

