import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { BasketItem } from '../../shared/models/Basket';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  /**
   *
   */
  constructor(public basketService:BasketService,public accountService:AccountService) {


  }

  ngOnInit(): void {
  }
  getCount(items:BasketItem[])
  {
    return items.reduce((sum,item)=>sum+item.quantity,0)
  }

}
