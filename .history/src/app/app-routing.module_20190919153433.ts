import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './pages/ba/login/login.module#LoginPageModule' },
  { path: 'app-list', loadChildren: './pages/ba/app-list/app-list.module#AppListPageModule' },
  { path: 'baapp-list', loadChildren: './pages/ba/baapp-list/baapp-list.module#BAAppListPageModule' },
  { path: 'ba-app-list', loadChildren: './pages/ba/ba-app-list/ba-app-list.module#BaAppListPageModule' },
  { path: 'ba-apps', loadChildren: './pages/ba/ba-apps/ba-apps.module#BaAppsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
