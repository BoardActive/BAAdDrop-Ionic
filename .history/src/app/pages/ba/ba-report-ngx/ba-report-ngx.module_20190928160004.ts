import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BaReportNgxPage } from './ba-report-ngx.page';

const routes: Routes = [
  {
    path: '',
    component: BaReportNgxPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BaReportNgxPage]
})
export class BaReportNgxPageModule {}
