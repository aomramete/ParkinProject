import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EachreservePage } from './eachreserve.page';

const routes: Routes = [
  {
    path: '',
    component: EachreservePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EachreservePageRoutingModule {}
