import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [GuardsService] },
  // { path: 'home', loadChildren: './pages/pozer/pozer-home/pozer-home.module#PozerHomePageModule', canActivate: [GuardsService] },
  { path: 'login', loadChildren: () => import('./pages/ba/login/login.module').then( m => m.LoginPageModule)},
  // { path: 'login', loadChildren: './pages/ba/login/login.module#LoginPageModule' },
  { path: 'ba-apps', loadChildren: './pages/ba/ba-apps/ba-apps.module#BaAppsPageModule' },
  { path: 'ba-message', loadChildren: './pages/ba/ba-message/ba-message.module#BaMessagePageModule' },
  { path: 'ba-messages', loadChildren: './pages/ba/ba-messages/ba-messages.module#BaMessagesPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
