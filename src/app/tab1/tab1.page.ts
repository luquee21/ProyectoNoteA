import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { Nota } from '../model/nota';
import { LoadingService } from '../services/loading.service';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';
import { TimeService } from '../services/time.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;

  private listaNotas = [];
  private listaNotasCopy: any;
  private flag: boolean = false;
  private page: number = 0;

  constructor(
    private modal: ModalService,
    private alertController: AlertController,
    private toast: ToastService,
    private loading: LoadingService,
    private http: HttpService,
    private auth: AuthService,
    private time: TimeService) {
  }
  ngOnInit(): void {
    this.cargaDatos(null, true);
  }

  public timeSince(timeCreated) {
    return this.time.timeSince(timeCreated);
  }



  public async cargaDatos($event?, reload?) {
    if (!$event) {
      await this.loading.presentLoading();
    }

    if (reload) {
      this.ionInfiniteScroll.disabled = false;
      this.page = 1;
      this.listaNotas = [];
    } else {
      this.page = this.page + 1;
      console.log("PAG " + this.page);
    }

    this.http.getAllNotes(this.auth.getUser().id, this.page).then(async (data) => {
      let dat = JSON.parse(data.data);
      if (dat.status == 1) {
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
        //Si el usuario no tenia notas muestro el texto de no tienes notas
        if (this.listaNotas == []) {
          this.flag = true;
        }
        this.ionInfiniteScroll.disabled = true;
      }

      //Sirve para ocultar el loading de ioninfinite o ionrefresh
      if ($event) {
        $event.target.complete();
      } else {
        await this.loading.cancelLoading();
      }

    }).catch(async (err) => {

      //Sirve para ocultar el loading de ioninfinite o ionrefresh
      if ($event) {
        $event.target.complete();
      } else {
        await this.loading.cancelLoading();
      }
      this.ionInfiniteScroll.disabled = true;
    })
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


  /**
   * Muestra el alert para borrar la nota
   * @param id id de la nota
   */


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

  /**
   * Muestra el alert para añadir una nota
   */

  public async showAddNote() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Añadir nota",
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
                await this.cargaDatos(null, true);
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

  /**
   * Borra la nota 
   * @param id id de la nota a borrar
   */

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
