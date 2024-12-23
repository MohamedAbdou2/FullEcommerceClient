import { Component, Input } from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent {
  @Input() checkoutForm?:FormGroup;
  deliveryMethods:DeliveryMethod[]=[];
   constructor(private checkoutService:CheckoutService,private basketService:BasketService) { }

   ngOnInit(): void {
     this.checkoutService.getDeliveryMethods().subscribe({
       next:dm=>this.deliveryMethods=dm
     })
   }

   setShippingPrice(deliveryMethod:DeliveryMethod)
   {
     this.basketService.setShippingPrice(deliveryMethod);
   }

}
