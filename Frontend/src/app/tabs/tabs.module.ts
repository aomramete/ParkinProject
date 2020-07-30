// import { HomePageModule } from './../home/home.module';
// import { PaymentPageModule } from './../payment/payment.module';
// import { ProfilePageModule } from './../profile/profile.module';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { IonicModule } from '@ionic/angular';

// import { TabsPageRoutingModule } from './tabs.router.module';

// import { TabsPage } from './tabs.page';

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     TabsPageRoutingModule,
//     ProfilePageModule,
//     PaymentPageModule,
//     HomePageModule
//   ],
//   declarations: [TabsPage]
// })
// export class TabsPageModule {}
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
