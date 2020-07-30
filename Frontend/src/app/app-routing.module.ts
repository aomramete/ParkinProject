// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'start', loadChildren: './tabs/tabs.module#TabsPageModule' },
//   { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';   
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'members',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'details/:myid',
    loadChildren: () => import('./pages/pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'reserve/:myid',
    loadChildren: () => import('./pages/pages/reserve/reserve.module').then( m => m.ReservePageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'reservedata',
    loadChildren: () => import('./reservedata/reservedata.module').then( m => m.ReservedataPageModule)
  },
  {
    path: 'eachreserve/:myid',
    loadChildren: () => import('./eachreserve/eachreserve.module').then( m => m.EachreservePageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./filter/filter.module').then( m => m.FilterPageModule)
  },
  {
    path: 'registerPage',
    loadChildren: () => import('./register-page/register-page.module').then( m => m.RegisterPagePageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full'
//   },
//   {
//     path: 'login',
//     loadChildren: './login/login.module#LoginPageModule'
//   },
//   { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}

// import { NgModule } from '@angular/core'; ของออม
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
//   },
//   {
//     path: 'tabs',
//     loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
//   },
//   {
//     path: 'details/:myid',
//     loadChildren: () => import('./pages/pages/details/details.module').then( m => m.DetailsPageModule)
//   },
//   {
//     path: 'reserve/:myid',
//     loadChildren: () => import('./pages/pages/reserve/reserve.module').then( m => m.ReservePageModule)
//   },
// ];
// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
