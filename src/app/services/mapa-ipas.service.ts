import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaIpasService {

  // url = `https://172.20.95.116/mapaexterno`;
  url = `http://localhost/mapaexterno`;
  constructor(private http: HttpClient) { }

  listaDepartamentos() {
    return this.http.post<any>(`${this.url}/mapa/listadepartamentos`,'');
  }

  listaIPAS(data: any) {
    return this.http.post<any>(`${this.url}/mapa/listadeipa`,data);
  }

}
