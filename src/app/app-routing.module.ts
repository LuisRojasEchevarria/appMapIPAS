import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { DetalleIpaComponent } from './detalle-ipa/detalle-ipa.component';
// import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',
    redirectTo: 'mapa',
    pathMatch: 'full'
  },
  {
    path: 'mapa',
    component: MapaComponent,
  },
  {
    path: 'detalle-ipa/:id',
    component: DetalleIpaComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
