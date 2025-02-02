import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from '../shop.service';
import { Product } from '../../shared/models/Product';
import { Brand } from '../../shared/models/Brands';
import { Type } from '../../shared/models/Types';
import { ShopParams } from '../../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
@ViewChild('search') searchTerm?:ElementRef;
 products:Product[] = [];
 brands:Brand[] = [];
 types:Type[] = [];
 brandIdSelected = 0;
 typeIdSelected = 0;
 shopParams=new ShopParams();
 sortOptions=[
  {name:'Alphabetical', value : 'name'},
  {name:'Price (Low to High)', value : 'priceAsc'},
  {name:'Price (High to Low)', value : 'priceDesc'}
 ]
  constructor(private _ShopService:ShopService) {}
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }
  totalCount=0;
  getProducts(){
    this._ShopService.getProducts(this.shopParams).subscribe({
      next:response=>{
        this.products=response.data;
        this.shopParams.pageNumber=response.pageIndex;
        this.shopParams.pageSize=response.pageSize;
        this.totalCount=response.count;
      },
      error: (error)=>console.log(error)
    });
  }

  getBrands(){
    this._ShopService.getBrands().subscribe({
      next: (response)=>this.brands=[{id:0,name:'All'},...response],
      error: (error)=>console.log(error)
    });
  }

  getTypes(){
    this._ShopService.getTypes().subscribe({
      next: (response)=>this.types=[{id:0,name:'All'},...response],
      error: (error)=>console.log(error)
    });
  }

  onBrandSelected(brandId:number)
  {
    this.shopParams.brandId=brandId;
    this.shopParams.pageNumber=1
    this.getProducts();
  }
  onTypeSelected(typeId:number)
  {
    this.shopParams.typeId=typeId;
    this.shopParams.pageNumber=1
    this.getProducts();
  }



  onSortSelected(event:any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }
  }

  onSearch()
  {
    this.shopParams.search=this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  onReset()
  {
    if(this.searchTerm) this.searchTerm.nativeElement.value=''
    this.shopParams= new ShopParams();
    this.getProducts();
  }
}
