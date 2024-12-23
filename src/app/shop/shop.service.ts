import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Brand } from '../shared/models/Brands';
import { Type } from '../shared/models/Types';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private _HttpClient:HttpClient) { }
   baseUrl = "https://localhost:7125/api/";

   getProducts(shopParams:ShopParams){
    let params=new HttpParams();
    if(shopParams.brandId>0)params=params.append("brandId",shopParams.brandId);
    if(shopParams.typeId)params=params.append("typeId",shopParams.typeId);
    params = params.append("sort",shopParams.sort)
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if(shopParams.search) params=params.append('search',shopParams.search);

    return this._HttpClient.get<Pagination<Product[]>>(this.baseUrl+'product',{params:params})
   }

   getBrands(){
    return this._HttpClient.get<Brand[]>(this.baseUrl + 'product/brands')
   }

   getTypes(){
    return this._HttpClient.get<Type[]>(this.baseUrl + 'product/types')
   }

   getProduct(id:number){
     return this._HttpClient.get<Product>(this.baseUrl + 'product/'+ id);
   }

}


