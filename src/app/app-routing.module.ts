import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';

const routes: Routes = [
  { path: '',
    redirectTo: 'mapa',
    pathMatch: 'full'
  },
  {
    path: 'mapa',
    component: MapaComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
