import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';
import { __spread } from 'tslib';
import { LoadingService } from '../services/loading.service';
import { HttpService } from '../services/http.service';
import { Usuario } from '../model/user';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { element } from 'protractor';
import { ChildActivationStart } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { notEqual } from 'assert';
import { TimeService } from '../services/time.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private listaNotas = [];
  private listaNotasCopy: any;
  private flag: boolean = false;

  constructor(
    private modal: ModalService,
    private alertController: AlertController,
    private toast: ToastService,
    private loading: LoadingService,
    private http: HttpService,
    private auth: AuthService,
    private time: TimeService) {
  }

  ionViewWillEnter() {
    this.cargaDatos();
  }

  public timeSince(timeCreated) {
    return this.time.timeSince(timeCreated);
  }



  public async cargaDatos($event = null) {
    if (this.auth.isLogged()) {
      if (!$event) {
        await this.loading.presentLoading();
      }
      this.http.getAllNotes(this.auth.getUser().id).then(async (data) => {
        let dat = JSON.parse(data.data);
        if (dat.status == 1) {
          this.listaNotas = [];
          dat.result.forEach(element => {
            let nota = {
              ...element
            }
            console.log(nota);
            this.listaNotas.push(nota);
          });

          this.listaNotasCopy = this.listaNotas;
          this.flag = false;
        } else if (dat.status == 2) {
          this.flag = true;
        }
        if ($event) {
          $event.target.complete();
        }
        await this.loading.cancelLoading();
      }).catch(async (err) => {
        await this.loading.cancelLoading();
        if ($event) {
          $event.target.complete();
        }
      })
    }
  }






  public filterList(evt: any) {
    const val = evt.target.value;
    this.listaNotasCopy = this.listaNotas;
    if (val && val.trim() != '') {
      this.listaNotasCopy = this.listaNotasCopy.filter((data) => {
        return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }



  public async muestraBorraNota(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar',
      message: '¿Está seguro que desea borrar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sí',
          handler: () => {
            this.borraNota(id);
          }
        }
      ]
    });

    await alert.present();
  }

  public async showAddNote() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Añadir nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
        }],
      message: 'Introduce el título de la nota',

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Añadir',
          handler: (data) => {
            this.http.createNote(data.title, this.auth.getUser().id).then(async (data) => {
              let dat = JSON.parse(data.data);
              if (dat.status == "1") {
                await this.toast.presentToast("Nota creada con éxito", "success");
              } else {
                this.toast.presentToast("No se ha podido crear la nota", "danger");
              }
            }).catch((err) => {
              this.toast.presentToast("No se ha podido crear la nota", "danger");
            })
          }
        }
      ]
    });

    await alert.present();
  }

  public borraNota(id: any) {
    this.http.deleteNote(id).then((data) => {
      let dat = JSON.parse(data.data);
      if (dat.status == "1") {
        this.toast.presentToast("Nota borrada correctamente", "danger");
        let tmp = [];
        this.listaNotas.forEach((nota) => {
          if (nota.id != id) {
            tmp.push(nota);
          }
        })
        this.listaNotas = tmp;
        this.listaNotasCopy = this.listaNotas;
      } else {
        this.toast.presentToast("No se ha podido borrar la nota", "danger");
      }
    }).catch((err) => {
      this.toast.presentToast(err, "danger");
    });

    let tmp = [];
    this.listaNotas.forEach((nota) => {
      if (nota.id != id) {
        tmp.push(nota);
      }
    })
    this.listaNotas = tmp;
  }

  public async addNote() {
    await this.showAddNote();
  }

  public async editaNota(nota: Nota) {
    await this.modal.editaNota(nota, this.auth.getUser());
  }
}
