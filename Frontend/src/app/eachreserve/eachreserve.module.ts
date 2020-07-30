import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EachreservePageRoutingModule } from './eachreserve-routing.module';

import { EachreservePage } from './eachreserve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EachreservePageRoutingModule
  ],
  declarations: [EachreservePage]
})
export class EachreservePageModule {}
