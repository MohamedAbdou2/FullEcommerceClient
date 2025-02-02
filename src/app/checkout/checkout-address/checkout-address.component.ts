import { Component, Input } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss'
})
export class CheckoutAddressComponent {
  @Input() checkoutForm?:FormGroup;
  constructor(private accountService:AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  saveUserAddress()
  {
    this.accountService.updateUserAddress(this.checkoutForm?.get('addressForm')?.value).subscribe({
    next:()=>{
      this.toastr.success('Address Saved');
      this.checkoutForm?.get('addressForm')?.reset(this.checkoutForm?.get('addressForm')?.value)
    }
    })
  }
}
