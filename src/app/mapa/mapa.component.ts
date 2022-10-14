import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapaIpasService } from 'src/app/services/mapa-ipas.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { REGIONES } from './peru-regiones.json';
import { AlertController } from '@ionic/angular';
import * as $ from 'jquery'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit   {

  private USGS_USImageryTopo ;
  private mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
  private mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  private streets;
  private satellite; 
  private CyclOSM;
  private osm;
  private map;
  private baseMaps;
  private layerControl;
  private marcador;  

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private serviceMapaIpas: MapaIpasService
  ) { }

  marcadorposicion:any = [];
  departamentos: any[] = [];
  dpas: any[] = [];

  formSearch = this.formBuilder.group(
    {
      idDepartamento: [null],
      idIpa: [null], 
      nomIpa: [null], 
    }
  );

  ngOnInit(): void {
    this.listaDepartamentos();
  }
  
  ionViewDidEnter(){
    this.initMap();
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

  listaDepartamentos(): void {
    this.serviceMapaIpas.listaDepartamentos().subscribe(
      result => {
        let temp: {
          Dpto_Id?: string;
          Dpto_Nombre?: string;
        } = {
          Dpto_Id:'TODOS',
          Dpto_Nombre:'TODOS'
        };
        result.unshift(temp);
        this.departamentos = result.filter(x=>x.Dpto_Id!='00');
      },
      error => {
        console.error(error);
      }
    ); 
  }

  listarIPAS(): void {
    if(this.formSearch.value.idDepartamento!='TODOS') {
      let formData = new FormData;
      formData.append('depa',this.formSearch.value.idDepartamento);
      this.serviceMapaIpas.listaIPAS(formData).subscribe(
        result => {
          if(result!='ERROR'){
            let temp: {
              Infra_Id?: string;
              NOM?: string;
            } = {
              Infra_Id:'TODOS',
              NOM:'TODOS'
            };
            result.unshift(temp);
            this.dpas = result;
          }else{
            console.log('ese departamento no tiene ipas');
            this.alert('ERROR','','No se encontraron registros');
          }
        },
        error => {
          console.error(error);
        }
      ); 
    } else {
      $('#filtro_dpa').val("TODOS").trigger("change");
    }
  }

  private initMap(): void {
    this.USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: ''
        // attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });
    
    this.streets = L.tileLayer(this.mapboxUrl, {
        id: 'mapbox/streets-v11', 
        tileSize: 512, 
        maxZoom: 20,
        zoomOffset: -1, 
        attribution: ''
    });
    
    this.satellite = L.tileLayer(this.mapboxUrl, {
        id: 'mapbox/satellite-v9', 
        tileSize: 512, 
        maxZoom: 20,
        zoomOffset: -1, 
        attribution: ''
    });
    
    this.CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
        // attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    this.osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
        // attribution: '© OpenStreetMap'
    });
    
    this.map = L.map('map', {
        center: [-12.0641, -77.0355],
        zoom: 5,
        layers: [this.satellite]
    });
    
    this.baseMaps = {
        "Satélite": this.satellite,
        "Calles": this.streets
    };

    this.layerControl = L.control.layers(this.baseMaps).addTo(this.map);
    this.layerControl.addBaseLayer(this.USGS_USImageryTopo, "Topográfico");
    this.layerControl.addBaseLayer(this.CyclOSM, "Ciclovías");
    this.layerControl.addBaseLayer(this.osm, "OpenStreetMap");

    L.geoJson(REGIONES).addTo(this.map);
    // document.querySelector(".leaflet-interactive").setAttribute('stroke','#ffffff');
    // document.querySelector(".leaflet-interactive").setAttribute('fill','#ffffff');

    this.marcador = L.icon({
      iconUrl: 'assets/icon/marker-icon-fondopes.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      // popupAnchor: [-3, -76],
      shadowUrl: 'assets/icon/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
    
    this.iniMarcadores();
  }

  // marckposicion = this.marcadorposicion;
  
  iniMarcadores(): void {
    let marck = this.marcador;
    let marckposicion = this.marcadorposicion;
    this.serviceMapaIpas.ipas().subscribe(
      result => {
        result.forEach(function (item) {
          let marker = new L.marker([item.Infra_Latitud,item.Infra_Longitud])
          .bindPopup('<a href="#"><span><h4 style="text-align: center;"><b>'+item.Infra_Nombre+'</b></h4></span></a><span><h2 style="font-size: 14px; text-align: center;">'+item.Departamento+' - '+item.Provincia+' - '+item.Distrito+'</h2></span>')
          .setIcon(marck)
          .on('click',function(ev) { ev.target.openPopup();});
          // .on('click', this.setOpen(true));
          marckposicion.push(marker);
        });        
        for(let i=0; i<marckposicion.length; i++){
          this.map.addLayer(marckposicion[i]);
        }
        this.map.setView([-12.064137562030421, -77.03555666235727], 5);
      },
      error => {
        console.error(error);
      }
    );
  }  
  
  filtrarIpas(): void {
    let marck = this.marcador;
    let dataSearch = this.formSearch.value;
    if(dataSearch.idDepartamento == '' || dataSearch.idDepartamento  == null || dataSearch.idDepartamento  == undefined){ dataSearch.idDepartamento  = 'TODOS'; }
    if(dataSearch.idIpa == '' || dataSearch.idIpa  == null || dataSearch.idIpa  == undefined){ dataSearch.idIpa  = 'TODOS'; }
    if(dataSearch.nomIpa  == null || dataSearch.nomIpa  == undefined){ dataSearch.nomIpa  = ''; }
    let formData = new FormData;
    formData.append('depa',dataSearch.idDepartamento);
    formData.append('tipo',dataSearch.idIpa);
    formData.append('nombre',dataSearch.nomIpa);
    this.serviceMapaIpas.ipasxfiltro(formData).subscribe(
      result => {
        if(result!='ERROR'){
          console.log(result);
          this.BorrarMarcador();
          let marckposicion = this.marcadorposicion;
          if(dataSearch.idDepartamento !='TODOS'){
            let depalati = result[0].Infra_DepLatitud;
            let depalong = result[0].Infra_DepLongitud;
            this.map.setView([depalati, depalong], 8);
          } else {
            this.map.setView([-12.064137562030421, -77.03555666235727], 5);
          }
          if(result.length==1){ this.FocusMarker(result[0].Infra_Latitud,result[0].Infra_Longitud); }
          result.forEach(function (item) {
            let marker = new L.marker([item.Infra_Latitud,item.Infra_Longitud])
            .bindPopup('<a href="#"><span><h4 style="text-align: center;"><b>'+item.Infra_Nombre+'</b></h4></span></a><span><h2 style="font-size: 14px; text-align: center;">'+item.Departamento+' - '+item.Provincia+' - '+item.Distrito+'</h2></span>')
            .setIcon(marck)
            .on('click',function(ev) { ev.target.openPopup();});
            // .on('click', this.setOpen(true));
            marckposicion.push(marker);
          }); 
          for(let i=0; i<marckposicion.length; i++){
            this.map.addLayer(marckposicion[i]);
          }
        }else{
          console.log('ese departamento no tiene ipas');
          this.alert('ERROR','','No se encontraron registros');
        }
      },
      error => {
        console.error(error);
      }
    ); 

  }

  buscar(): void {
    console.log('btn buscar');
    this.filtrarIpas();
  }

  limpiar(): void {
    console.log('btn limpiar');
    $('#filtro_depa').val("TODOS").trigger("change");
    $('#inputnombre').val("");
    this.iniMarcadores();
  }

  isModalOpen:boolean = false;
  texto: string = "";
  setOpen(isOpen: boolean) {
    this.texto = "funciono";
    this.isModalOpen = isOpen;
  }

  FocusMarker(lat,lon){
    this.map.setView([lat, lon], 12); 
  }

  BorrarMarcador() {  
    for(let i=0;i<this.marcadorposicion.length;i++) {
        this.map.removeLayer(this.marcadorposicion[i]);
    }
    if(this.marcadorposicion.length>0){
        this.marcadorposicion = [];
    } else {
        
    }
  }

}
