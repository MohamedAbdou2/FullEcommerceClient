import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerComponent } from './pager/pager.component';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { ReactiveFormsModule } from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { StepperComponent } from './components/stepper/stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';

@NgModule({
  declarations: [
    PagerComponent,
    PagingHeaderComponent,
    OrderTotalsComponent,
    StepperComponent,
    BasketSummaryComponent,

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    CdkStepperModule
  ],
  exports: [PaginationModule,PagerComponent,PagingHeaderComponent,CarouselModule,OrderTotalsComponent,ReactiveFormsModule,BsDropdownModule,CdkStepperModule,BasketSummaryComponent,StepperComponent]
})
export class SharedModule { }
