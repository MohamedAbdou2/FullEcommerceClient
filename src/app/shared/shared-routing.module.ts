import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from '../shop/shop/shop.component';
import { ProductDetailsComponent } from '../shop/product-details/product-details.component';

const routes: Routes = [
  {path: '', component:ShopComponent},
  {path:':id',component:ProductDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
