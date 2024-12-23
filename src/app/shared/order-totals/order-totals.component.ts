import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrl: './order-totals.component.scss'
})
export class OrderTotalsComponent  implements OnInit {

  constructor(public basketService:BasketService) { }

  ngOnInit(): void {
    console.log("totals")
    console.log(this.basketService.basketTotalSource$)
  }

}
