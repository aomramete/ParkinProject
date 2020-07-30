import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservedataPage } from './reservedata.page';

const routes: Routes = [
  {
    path: '',
    component: ReservedataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservedataPageRoutingModule {}
