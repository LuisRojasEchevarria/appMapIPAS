import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaIpasService {

  url = `${environment.HOST_URL}/servicioMapaexterno`;

  constructor(private http: HttpClient) { }

  listaDepartamentos() {
    return this.http.post<any>(`${this.url}/listadepartamentos`,'');
  }

  listaIPAS(data: any) {
    return this.http.post<any>(`${this.url}/listadeipa`,data);
  }

  ipas() {
    return this.http.post<any>(`${this.url}/ipas`,'');
  }
  
  ipasxfiltro(data: any) {
    return this.http.post<any>(`${this.url}/ipasxfiltro`,data);
  }

  buscarxid(data: any) {
    return this.http.post<any>(`${this.url}/buscarxid`,data);//cambiar url para traer al data
  }

  cantidadFotos(data: any) {
    return this.http.post<any>(`${this.url}/obtenercantidadfotos`,data);
  }

}
