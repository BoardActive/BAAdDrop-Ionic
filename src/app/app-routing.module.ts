import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [
  { path: '', redirectTo: 'ba-messages', pathMatch: 'full' },
  { path: 'ba-messages', loadChildren: () => import('./pages/ba/ba-messages/ba-messages.module').then( m => m.BaMessagesPageModule), canActivate: [GuardsService] },
  { path: 'login', loadChildren: () => import('./pages/ba/login/login.module').then( m => m.LoginPageModule)},
  { path: 'ba-apps', loadChildren: './pages/ba/ba-apps/ba-apps.module#BaAppsPageModule' },
  { path: 'ba-message', loadChildren: () => import('./pages/ba/ba-message/ba-message.module').then( m => m.BaMessagePageModule)},
  // { path: 'ba-message', loadChildren: './pages/ba/ba-message/ba-message.module#BaMessagePageModule' },
  // { path: 'ba-messages', loadChildren: './pages/ba/ba-messages/ba-messages.module#BaMessagesPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
