import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesipaPage } from './detallesipa.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesipaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesipaPageRoutingModule {}
