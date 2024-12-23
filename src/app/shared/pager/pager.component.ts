import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent {
  @Input() totalCount?:number;
  @Input() pageSize?:number;
  @Output() pageChanged = new EventEmitter<number>();

   constructor() { }

   ngOnInit(): void {
   }

   onPagerChanged(event:any)
   {
     this.pageChanged.emit(event)
   }

}
