import { Component,  } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { AlertController, Platform, } from '@ionic/angular';
import { environment } from 'src/environments/environment';
// import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public getCoordenadas: any[] = [];

  constructor(
    // private diagnostic: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    private alertController: AlertController,
    private geolocation: Geolocation,
    private platform: Platform
    
  ) {
    this.platform.ready().then(async () => {
      this.validarPermisos(); 
    });
  }

  validarPermisos(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
          if (result.hasPermission) {
              // If having permission show 'Turn On GPS' dialogue
              // this.alert('GPS','','GPS location is enabled');
              return true;
          } else {
              // If not having permission ask for permission
              // this.alert('ERROR','','GPS location is disabled');
              return false;
          }
      },
      err => { alert(err); }
    );
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      (result) => {
        if (result.hasPermission) {
          // call method to turn on GPS
          this.encenderGPS();
          return 'GOT_PERMISSION';
        } else {
          return 'DENIED_PERMISSION';
        }
      },
      error => {
        // Show alert if user click on 'No Thanks'
        // alert('requestPermission Error requesting location permissions ' + error);
        alert('Error al pedir permisos de localización ' + error);
      }
    );
  }

  encenderGPS(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            // this.alert('AVISO','','GPS fue activado');
            this.getGeolocation(); 
            return true;
          },
          error => { 
            this.getGeolocation(); 
            return false; 
          } 
        );
      }
      else { return false; }
    });
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
      } else {
        this.getCoordenadas = ['',''];
        environment.mycordinates=this.getCoordenadas;
        // console.log('Coor vacías: ',environment.mycordinates);
      }
    }).catch((error) => {
      this.getCoordenadas = ['',''];
      environment.mycordinates=this.getCoordenadas;
      // console.log('Coor sin datos: ',environment.mycordinates);
    });
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
}
