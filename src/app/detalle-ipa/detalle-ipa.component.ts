import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MapaIpasService } from 'src/app/services/mapa-ipas.service';

@Component({
  selector: 'app-detalle-ipa',
  templateUrl: './detalle-ipa.component.html',
  styleUrls: ['./detalle-ipa.component.scss'],
})
export class DetalleIpaComponent implements OnInit {

  id:any;
  nombre: string;

  constructor(
    private alertController: AlertController,
    private serviceMapaIpas: MapaIpasService
  ) {
    let url = window.location.href;
    this.id = +url.split("detalle-ipa/")[1];
   }

  ngOnInit() {
    let formData = new FormData;
    formData.append('id',this.id);
    this.serviceMapaIpas.buscarxid(formData).subscribe(
      result => {
        console.log(result);
        if(result!='ERROR'){
          this.cargarData(result[0]);
        }else{
          this.alert('ERROR','','No se encontraron registros');
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  async alert(titulo,subTitulo,mensaje) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  cargarData(data:any){
    console.log(data);
    this.nombre = data.Infra_Nombre;
  }

}
