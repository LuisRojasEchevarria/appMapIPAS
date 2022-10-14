import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesipaPageRoutingModule } from './detallesipa-routing.module';

import { DetallesipaPage } from './detallesipa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesipaPageRoutingModule
  ],
  declarations: [DetallesipaPage]
})
export class DetallesipaPageModule {}
