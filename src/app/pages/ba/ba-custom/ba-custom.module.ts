import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaCustomPageRoutingModule } from './ba-custom-routing.module';

import { BaCustomPage } from './ba-custom.page';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BaCustomPageRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: BaCustomPage
      }
    ])
  ],
  declarations: [BaCustomPage]
})
export class BaCustomPageModule {}
