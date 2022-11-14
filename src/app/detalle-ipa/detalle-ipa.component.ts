import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import * as $ from 'jquery';
import { MapaIpasService } from 'src/app/services/mapa-ipas.service';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-detalle-ipa',
  templateUrl: './detalle-ipa.component.html',
  styleUrls: ['./detalle-ipa.component.scss'],
})

export class DetalleIpaComponent {

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
  audiourl: string;
  lati: any;
  longi: any;
  cordina: any[] = [];
  public getCoordenadas: any[] = [];

  constructor(
    private alertController: AlertController,
    private serviceMapaIpas: MapaIpasService,
    private platform: Platform,
    private geolocation: Geolocation
  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      $("#btnbackmain").click();
    });
    this.platform.ready().then(async () => {
      this.getGeolocation();
    });
  }

  ngOnInit() {
    
  }

  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      if(resp){
        // console.log('datos: ',resp)
        this.getCoordenadas = [
          resp.coords.latitude,
          resp.coords.longitude
        ];
        environment.mycordinates=this.getCoordenadas;
        // console.log('Coordenadas: ',environment.mycordinates);
        this.buscarData();
      } else {
        this.getCoordenadas = ['',''];
        environment.mycordinates=this.getCoordenadas;
        // console.log('Coor vacías: ',environment.mycordinates);
        this.buscarData();
      }
    }).catch((error) => {
      this.getCoordenadas = ['',''];
      environment.mycordinates=this.getCoordenadas;
      // console.log('Coor sin datos: ',environment.mycordinates);
      this.buscarData();
    });
  }

  buscarData() {
    let url = window.location.href;
    this.id = url.split("detalle-ipa/")[1];
    this.cordina = environment.mycordinates;
    // console.log('Return ipa: ',this.cordina);
    // this.alert('Return ipa','',this.cordina);
    this.lati = this.cordina[0];
    this.longi = this.cordina[1];
    if(this.lati=='' || this.lati==null || this.lati==undefined){ this.lati=''}
    if(this.longi=='' || this.longi==null || this.longi==undefined){ this.longi=''}
    // console.log('Estas son: ',this.id+' + '+this.lati+' + '+this.longi);
    // this.alert('AVISO','',this.id+' + '+this.lati+' + '+this.longi);
    let formData = new FormData;
    formData.append('id',this.id);
    formData.append('latitud',this.lati);
    formData.append('longitud',this.longi);

    this.serviceMapaIpas.buscarxid(formData).subscribe(
      result => {
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
          this.obteneraudio();
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
          // console.log('ese departamento no tiene imagenes');
          this.alert('AVISO','','No se encontraron imágenes para este Desembarcadero.');
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  obteneraudio(): void{
    $("#audioplay").removeAttr("autoplay");
    $("#audioplay").removeAttr("controls");
    $("#audioplay").removeAttr("load");
    $("#cardaudio").html('');
    document.getElementById("cardaudio").style.display = "none";
    if(this.audiourl != ''){
      $('#cardaudio').html('<audio id="audioplay" style="width: 100%;"></audio>');
      $("#audioplay").html('');
      $("#audioplay").html(''+
        '<source src="' +this.audiourl+ '" type="audio/mp3">'+
      '');
      document.getElementById("cardaudio").style.display = "block";
      $("#audioplay").attr("load","load");
      $("#audioplay").attr("controls","true");
      $("#audioplay").attr("autoplay","true");
      $("#audioplay").load();
      $("#audioplay").play();
    }
  }

}
