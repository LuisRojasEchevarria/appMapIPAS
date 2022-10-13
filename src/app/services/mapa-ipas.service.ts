import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaIpasService {

  url = `${environment.HOST_URL}/serviciomapaexterno`;
  
  constructor(private http: HttpClient) { }

  listaDepartamentos() {
    return this.http.post<any>(`${this.url}/listadepartamentos`,'');
  }

  listaIPAS(data: any) {
    return this.http.post<any>(`${this.url}/listadeipa`,data);
  }

}
