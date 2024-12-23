import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {
  @Input() appStepper?:CdkStepper;

  constructor(private basketService:BasketService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  createPaymentIntent()
  {
    this.basketService.createPaymentIntent().subscribe({
      next:()=>{
        this.toastr.success('Payment Intent Created')
        this.appStepper?.next();
      },
      error:(erorr: { message: any; })=>{
        this.toastr.error(erorr.message)
      }
    })
  }

}
