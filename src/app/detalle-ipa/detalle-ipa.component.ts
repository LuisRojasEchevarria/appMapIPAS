import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { $ } from 'protractor';
import { MapaIpasService } from 'src/app/services/mapa-ipas.service';

@Component({
  selector: 'app-detalle-ipa',
  templateUrl: './detalle-ipa.component.html',
  styleUrls: ['./detalle-ipa.component.scss'],
})
export class DetalleIpaComponent implements OnInit {

  id: any;
  nombre: string;
  nombreipa: string;
  ubiipa: string;
  tipoipa: string;
  habiipa: string;
  ihcond: any;
  estaipa: any;
  itcond: any;
  dispoleipa: string;
  nombreipabuscar: string;
  urldocumento: string;
  numfotos: any;
  imagenes: any[] = [];

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
          let valor = result[0];
          let habdet = '';
          let tipo_mostrar = '';
          if(valor.I_HAB_DET == '2'){
              habdet = 'INTEGRAL (DESCARGA)';
          } else if(valor.I_HAB_DET == '1'){
              habdet = 'PARCIAL (DESCARGA/TAREAS PREVIAS)';
          } else {
              habdet = 'NINGUNO';
          }

          if(valor.Infra_Nombre=='' || valor.Infra_Nombre==null || valor.Infra_Nombre==undefined || valor.Infra_Nombre=='-'){valor.Infra_Nombre='';}
          if(valor.Infra_Tipo=='' || valor.Infra_Tipo==null || valor.Infra_Tipo==undefined || valor.Infra_Tipo=='-'){valor.Infra_Tipo='';}
          if(valor.Departamento=='' || valor.Departamento==null || valor.Departamento==undefined || valor.Departamento=='-'){valor.Departamento='';}
          if(valor.Provincia=='' || valor.Provincia==null || valor.Provincia==undefined || valor.Provincia=='-'){valor.Provincia='';}
          if(valor.Distrito=='' || valor.Distrito==null || valor.Distrito==undefined || valor.Distrito=='-'){valor.Distrito='';}
          if(valor.V_DISPOSITIVO_LEGAL=='' || valor.V_DISPOSITIVO_LEGAL==null || valor.V_DISPOSITIVO_LEGAL==undefined || valor.V_DISPOSITIVO_LEGAL=='-'){valor.V_DISPOSITIVO_LEGAL='';}
          switch (valor.Infra_Tipo) {    
            case 'AFA':
              tipo_mostrar = 'AFA - ATRACADERO FLOTANTE ARTESANAL';
              break;
            case 'CA':
              tipo_mostrar = 'CA - CENTRO ACUÍCOLA';
              break;
            case 'CEP':
              tipo_mostrar = 'CEP - CENTRO DE ENTRENAMIENTO PESQUERO';
              break;
            case 'CP':
              tipo_mostrar = 'CP - CENTRO PESQUERO';
              break;
            case 'DPA':
              tipo_mostrar = 'DPA - DESEMBARCADERO PESQUERO ARTESANAL';
              break;
            case 'MFA':
              tipo_mostrar = 'MFA - MUELLE FISCAL ARTESANAL';
              break;
            case 'MPA':
              tipo_mostrar = 'MPA - MUELLE PESQUERO ARTESANAL';
              break;
            case 'SC':
              tipo_mostrar = 'SC - ';
              break;
            case 'TPZ':
              tipo_mostrar = 'TPZ - TERMINAL PESQUERO ZONAL';
              break;
            }
            this.nombreipa = valor.Infra_Nombre;
            this.tipoipa = tipo_mostrar;
            this.ubiipa = valor.Departamento +' - '+ valor.Provincia +' - '+ valor.Distrito;
            this.habiipa = habdet;
            this.ihcond = valor.B_HAB;
            this.estaipa = valor.I_EST;
            this.itcond = valor.B_TRANS;
            this.dispoleipa = valor.V_DISPOSITIVO_LEGAL;
            this.nombreipabuscar = valor.nombredpa;
            this.nombreipabuscar = this.nombreipabuscar.replace(' ','');
            this.urldocumento = 'https://intranet2.fondepes.gob.pe/DOCUMENTO/SIMON/Mapas_Imagenes_Externos/'+this.nombreipabuscar+'/dpa/';
            this.obtenercantidadfotos();
            // console.log(this.urldocumento);
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

  obtenercantidadfotos(): void{
    let formData = new FormData;
    formData.append('carpeta',this.nombreipabuscar);
    this.serviceMapaIpas.cantidadFotos(formData).subscribe(
      result => {
        if(result!='ERROR'){
          this.numfotos=result;
          for(let i=0; i<this.numfotos; i++){
            let url = this.urldocumento+'Imagen'+i+'.jpg';
            this.imagenes.push({url: url});
          }
        }else{
          console.log('ese departamento no tiene imagenes');
          this.alert('ERROR','','No se encontraron Imágenes');
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  cargarData(data:any){
    console.log(data);
    this.nombre = data.Infra_Nombre;
  }

}
