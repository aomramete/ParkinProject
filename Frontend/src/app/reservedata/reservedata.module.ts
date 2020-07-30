import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservedataPageRoutingModule } from './reservedata-routing.module';

import { ReservedataPage } from './reservedata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservedataPageRoutingModule
  ],
  declarations: [ReservedataPage]
})
export class ReservedataPageModule {}
