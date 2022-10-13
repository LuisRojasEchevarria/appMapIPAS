import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaIpasService {

  // url = `https://intranet2.fondepes.gob.pe/mapaexterno/serviciomapaexterno`;
  // url = `https://172.20.95.116/mapaexterno/serviciomapaexterno`;
  url = `http://localhost/mapaexterno/serviciomapaexterno`;
  
  constructor(private http: HttpClient) { }

  listaDepartamentos() {
    return this.http.post<any>(`${this.url}/listadepartamentos`,'');
  }

  listaIPAS(data: any) {
    return this.http.post<any>(`${this.url}/listadeipa`,data);
  }

}
