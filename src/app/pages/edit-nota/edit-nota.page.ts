import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { Map, tileLayer, marker } from 'leaflet';
import { GpsService } from 'src/app/services/gps.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';


@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})
export class EditNotaPage implements OnInit {

  @Input('nota') nota: Nota;
  public map: Map;
  public latitud;
  public longitud;
  public tasks: FormGroup;
  public newMarker: any;
  public data: Nota;
  public showMap:boolean = false;
  public usersShared: Array<User> = [];

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private http: HttpService,
    private toast: ToastService,
    private gps: GpsService,
    private auth: AuthService,
    private controller:ModalController,
    private popover: PopoverController,
    private alertController: AlertController
  ) {
    this.tasks = this.formBuilder.group({
      description: ['', Validators.required]
    });
    
  }

  async ngOnInit() {
    this.tasks.get('description').setValue(this.nota.content);
    this.latitud = this.nota.latitude;
    this.longitud = this.nota.longitude;
    if ((this.longitud != 'undefined' && this.latitud != 'undefined') && (this.longitud != 0 && this.latitud != 0)) {
      console.log(this.longitud);
      this.loadMap();
    }
    if (this.nota.shared == 1) {
      await this.getUsersShared();
    }
  }

  public async getUsersShared() {
    this.http.getSharedUsers(this.nota.id).then((data) => {

      let dat = JSON.parse(data.data);
      if (dat.status == "1") {
        dat.result.forEach(element => {
          this.usersShared.push(element.user);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  public loadMap() {
    this.showMap = true;
      this.map = new Map("mapa").setView([this.latitud, this.longitud], 13);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' })
        .addTo(this.map);

      this.newMarker = marker([this.latitud, this.longitud], {
        draggable:
          true
      }).addTo(this.map);
      this.newMarker.bindPopup("Nota guardada aquí").openPopup();
      setTimeout(()=>{
        this.map.invalidateSize();
      }, 400);
  }
  public async dismissModal(){
    await this.controller.dismiss();
  }

  public async askLocation() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ubicación',
      message: '¿Desea guardar la ubicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sí',
          handler: async () => {
            await this.loading.presentLoading();
            await this.gps.getPosition().then(async (data) => {
              this.latitud = data.coords.latitude;
              this.longitud = data.coords.longitude;
              await this.toast.presentToast("Coordenadas obtenidas correctamente", "success");
              console.log(this.latitud + " " + this.longitud);
              await this.loading.cancelLoading();
              if(this.tasks.get('description').value == ""){
                this.tasks.get('description').setValue("coords");
              }
              await this.saveNote();
            }).catch(async (err) => {
              await this.toast.presentToast("No se ha podido guardar la ubicación", "danger");
              await this.loading.cancelLoading();
            })
          }
        }
      ]
    });

    await alert.present();
  }



  public async saveNote() {
    await this.loading.presentLoading();
      this.http.updateNoteContent(this.tasks.get('description').value, this.nota.id, this.auth.getUser().id, this.latitud, this.longitud).then(async (data) => {
        let dat = JSON.parse(data.data);
        if (dat.status == "1") {
          await this.toast.presentToast("Nota guardada", "success");
        } else {
          await this.toast.presentToast("No se ha podido guardar la nota", "danger");
        }
        await this.loading.cancelLoading();
      }).catch(async (err) => {
        await this.loading.cancelLoading();
      })

  }


  public async presentPopover(ev: any) {
    let owner, isShared;
    console.log(this.auth.getUser().name + " " + this.nota.user);
    if (this.auth.getUser().name == this.nota.user) {
      owner = true;
    } else {
      owner = false;
    }

    if (this.nota.shared == 1) {
      isShared = true;
    } else {
      isShared = false;
    }

    const popover = await this.popover.create({
      component: PopoverComponent,
      event: ev,
      animated: true,
      componentProps: {
        nota: this.nota,
        user: this.auth.getUser(),
        owner: owner,
        isShared: isShared,
        users: this.usersShared
      }

    });
    return await popover.present();
  }








}
