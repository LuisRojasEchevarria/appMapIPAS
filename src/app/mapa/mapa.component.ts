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
    private serviceMapaIpas: MapaIpasService
  ) { }

  marcadorposicion:any = [];
  departamentos: any[] = [];
  dpas: any[] = [];

  formSearch = this.formBuilder.group(
    {
      idDepartamento: [null],
      idIpa: [null], 
      txt_search: [null], 
    }
  );

  ngOnInit(): void {
    this.listaDepartamentos();
  }
  
  ionViewDidEnter(){
    this.initMap();
  }

  listaDepartamentos(): void {
    this.serviceMapaIpas.listaDepartamentos().subscribe(data => {
      this.departamentos = data;
    }); 
  }

  listarIPAS(): void {
    let depa = this.formSearch.value.idDepartamento;
    let formData = new FormData;
    formData.append('depa',depa);
    this.serviceMapaIpas.listaIPAS(formData).subscribe(data => {
      this.dpas = data;
    }); 
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

    // L.geoJson(this.regiones).addTo(this.map);

    // $('.leaflet-interactive').attr('stroke','#ffffff');
    // $('.leaflet-interactive').attr('fill','#ffffff');

    this.marcador = L.icon({
      iconUrl: 'assets/icon/marker-icon.png',
      // iconSize: [38, 95],
      // iconAnchor: [22, 94],
      // popupAnchor: [-3, -76],
      // shadowUrl: 'assets/icon/my-icon-shadow.png',
      // shadowSize: [68, 95],
      // shadowAnchor: [22, 94]
    });
    
    this.iniMarcadores();
  }

  
  private iniMarcadores(): void {
    console.log('iniMarcadores');
    


    var marker = new L.marker([-12.064137562030421, -77.03555666235727])
    .bindPopup('info de la obra')
    .setIcon(this.marcador)
    .on('click',function(ev) { ev.target.openPopup();})
    .on('mouseover', function(ev) { ev.target.openPopup(); });

    this.marcadorposicion.push(marker);
    for(let i=0; i<this.marcadorposicion.length; i++){
      this.map.addLayer(this.marcadorposicion[i]);
    }
  }  

  buscar(): void {
    let data = this.formSearch.value;
    console.log('buscar');
    console.log(data);
  }

  limpiar(): void {
    console.log('limpiar');
  }

}
