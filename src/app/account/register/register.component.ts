import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private fb:FormBuilder,private accountService:AccountService,private router:Router) { }
  registerForm=this.fb.group({
    displayName:['',Validators.required],
    email:['',Validators.required],
    password:['',Validators.required]
  })
  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.registerForm.value)
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/shop')
    })
  }
}
