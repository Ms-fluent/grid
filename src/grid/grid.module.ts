import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsGrid} from './grid';
import {MsGridItem } from './grid-item';
import {MsGridItemDef} from './grid-item-def';

@NgModule({
  imports: [CommonModule],
  declarations: [MsGrid, MsGridItemDef, MsGridItem],
  exports: [MsGrid, MsGridItemDef, MsGridItem]
})
export class MsGridModule {

}
