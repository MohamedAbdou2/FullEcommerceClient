import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { Basket } from '../../shared/models/Basket';
import { firstValueFrom } from 'rxjs';
import { OrderToCreate } from '../../shared/models/Order';
import { Address } from '../../shared/models/user';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?:FormGroup;
  @ViewChild('cardNumber') cardNumberElement?:ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?:ElementRef;
  @ViewChild('cardCvc') cardCvcElement?:ElementRef;

  stripe:Stripe|null=null;
  cardNumber?:StripeCardNumberElement;
  cardExpiry?:StripeCardExpiryElement;
  cardCvc?:StripeCardCvcElement;

  cardErrors:any;




  constructor(private toastr:ToastrService,
            private checkoutService:CheckoutService,
            private router:Router,
            private basketService:BasketService) { }

  ngOnInit(): void {
    loadStripe('pk_test_51QYqseA8ehTEt3NzRXV3fpHsIZsR0eNpycoWDrIw3IshVeqhZijttqxuCZWUDvsmsNyqKw9JlD5W37SGJhw3VXsV00to04pxat').then(stripe=>{
      this.stripe=stripe;
      const elements=stripe?.elements();
      if(elements)
      {
        this.cardNumber=elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change',event=>{
          if(event.error)this.cardErrors=event.error.message
          else this.cardErrors=null
        })

        this.cardExpiry=elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change',event=>{
          if(event.error)this.cardErrors=event.error.message
          else this.cardErrors=null
        })

        this.cardCvc=elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change',event=>{
          if(event.error)this.cardErrors=event.error.message
          else this.cardErrors=null
        })
      }
    })
  }


  async submitOrder()
  {

    const basket=this.basketService.getCurrentBsketValue();
    if(!basket) throw new Error('Cannot get the basket');

    try {
      const createdOrder= await this.createOrder(basket);
      const paymentResult= await this.confirmPaymentWithStripe(basket);
      if(paymentResult.paymentIntent)
          {
            this.basketService.deleteBasket(basket);
            const navigationExtras:NavigationExtras ={state:createdOrder};
            this.router.navigate(['checkout/success'],navigationExtras);
          }
          else
          {
            this.toastr.error(paymentResult.error.message)
          }
    } catch (error:any) {
      this.toastr.error(error.message);
    }
  }


  confirmPaymentWithStripe(basket: Basket | null) {
    if(!basket) throw new Error('basket is null');
    const result=this.stripe?.confirmCardPayment(basket.clientSecret!,{
      payment_method:{
        card:this.cardNumber!,
        billing_details:{
          name:this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
    if(!result)
    {
      throw new Error('Error Attempting payment with stripe');
    }
    return result;
  }
  private async createOrder(basket: Basket | null) {
    if(!basket) throw new Error('basket is null');
    const orderToCreate= this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket:Basket):OrderToCreate
  {
    const deliveryMethodId=this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shippToAddress= this.checkoutForm?.get('addressForm')?.value as Address;

    if(!deliveryMethodId || !shippToAddress) throw new Error('Problem with basket');

    return {
      basketId:basket.id,
      deliveryMethodId:deliveryMethodId,
      shipToAddress:shippToAddress

    }
  }

}
