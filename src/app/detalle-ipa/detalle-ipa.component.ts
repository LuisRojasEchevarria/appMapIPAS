import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as $ from 'jquery'
import { MapaIpasService } from 'src/app/services/mapa-ipas.service';
// import * as Anychart from 'anychart';
import { ChartOptions } from 'chart.js';


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
  estcon: string;
  urldocumento: string;
  itcond: any;
  dispoleipa: string;
  nombreipabuscar: string;
  colorestado: string;
  valestado: any;
  numfotos: any;
  imagenes: any[] = [];
  json: any[] = [];
  audiourl: string;


  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [];
  public pieChartDatasets = [];
  public pieChartLegend = true;
  public tooltip = false;
  public pieChartPlugins = [];
  public innerRadius = 100;
  public stroke = "";

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
          if(valor.I_EST != '4'){
            if(valor.I_HAB_DET == '2'){
                if(valor.Infra_Id == '56'){
                    habdet = 'CUENTA CON HABILITACIÓN SANITARIA (MOLUSCOS BIVALVOS)';
                } else {
                    habdet = 'CUENTA CON HABILITACIÓN SANITARIA';
                }
            } else if(valor.I_HAB_DET == '1'){
                if(valor.Infra_Id == '56'){
                    habdet = 'CUENTA CON HABILITACIÓN SANITARIA (MOLUSCOS BIVALVOS)';
                } else {
                    habdet = 'CUENTA CON HABILITACIÓN SANITARIA';
                }
            } else {
                habdet = 'NO HABILITADO';
            }
          }
          if(valor.I_EST == '1'){
            this.valestado = valor.I_EST;
            this.estcon = 'Operativo';
            this.colorestado = '#498135';
          } else if(valor.I_EST == '0'){
            this.valestado = valor.I_EST;
            this.estcon = 'No Operativo';
            this.colorestado = '#f39c12';
          } else if(valor.I_EST == '3'){
            this.valestado = valor.I_EST;
            this.estcon = 'Parcialmente Operativo';
            this.colorestado = '#87c571';
          } else if(valor.I_EST == '4'){
            this.valestado = valor.I_EST;
            this.estcon = 'Proyecto Nuevo';
            this.colorestado = '#00c5eb';
          } else {
            this.estcon = 'Sin Datos';
            this.colorestado = '#ffffff';
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
            this.nombreipabuscar = this.nombreipabuscar.replace(/ /g,'');
            this.urldocumento = 'https://intranet2.fondepes.gob.pe/DOCUMENTO/SIMON/Mapas_Imagenes_Externos/'+this.nombreipabuscar+'/dpa/';
            this.audiourl = 'https://intranet2.fondepes.gob.pe/DOCUMENTO/SIMON/Mapas_Audios_Externos/'+this.nombreipabuscar+'/audio/audio0.mp3';
            this.obtenercantidadfotos();
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
          this.alert('AVISO','','No se encontraron imágenes para este Desembarcadero.');
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  // ionViewDidLoad(): void {
  //   // create an instance of a pie chart
	// var chart = Anychart.pie();
	// // set the data
	// chart.data([
	// 	["Chocolate",12]
	// ]);
	// //chart.data.bind().dataLabels("enabled","false");
	// chart.innerRadius(200);
	// chart.normal().fill("#82B64C", 0.5);
	// chart.hovered().fill("#82B64C", 0.5);
	// chart.selected().fill("#82B64C", 0.7);
	// chart.labels(false);
	// chart.selected().labels(false);
	// chart.hovered().labels(false);
	// chart.tooltip(false);
	// // set chart title
	// chart.title("Top 5 pancake fillings");
	// // set the container element 
	// chart.container("container");
	// // initiate chart display
	// chart.draw();
  // }

  pie():void {
  //  this.pieChartLabels = [ this.estcon ];
  //  this.pieChartDatasets = [ {data: [ 100 ]} ];
  //  this.innerRadius = 200;
  //  this.tooltip = false;
  //  this.pieChartLegend = true;
  //  this.pieChartPlugins = [];
  //  this.stroke = this.colorestado;
  //  // document.querySelector(".chartestado").setAttribute('stroke','#ffffff');
  
  }

}
