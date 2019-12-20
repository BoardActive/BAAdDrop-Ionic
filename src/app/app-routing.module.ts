import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [
  { path: '', redirectTo: 'ba-messages', pathMatch: 'full' },
  { path: 'ba-messages', loadChildren: () => import('./pages/ba/ba-messages/ba-messages.module').then( m => m.BaMessagesPageModule), canActivate: [GuardsService] },
  { path: 'login', loadChildren: () => import('./pages/ba/login/login.module').then( m => m.LoginPageModule)},
  { path: 'ba-apps', loadChildren: () => import('./pages/ba/ba-apps/ba-apps.module').then( m => m.BaAppsPageModule)},
  { path: 'ba-message', loadChildren: () => import('./pages/ba/ba-message/ba-message.module').then( m => m.BaMessagePageModule)},
  { path: 'ba-user', loadChildren: './pages/ba/ba-user/ba-user.module#BaUserPageModule' },
  { path: 'ba-custom', loadChildren: './pages/ba/ba-custom/ba-custom.module#BaCustomPageModule' },
  // { path: 'ba-custom', loadChildren: () => import('./pages/ba/ba-custom/ba-custom.module').then( m => m.BaCustomPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
