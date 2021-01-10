import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams, PopoverController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { Usuario } from 'src/app/model/user';
import { HttpService } from 'src/app/services/http.service';
import { TimeService } from 'src/app/services/time.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  private nota: Nota;
  private user: Usuario;
  private owner: boolean;
  private isShared: boolean;
  private usersShared = [];

  constructor(private navParams: NavParams,
    private alertController: AlertController,
    private http: HttpService,
    private toast: ToastService,
    private route: Router,
    private time: TimeService,
    private popover: PopoverController,
    private modal: ModalController) {
    this.nota = this.navParams.get("nota");
    this.user = this.navParams.get("user");
    this.usersShared = this.navParams.get("users");
    this.owner = this.navParams.get("owner");
    this.isShared = this.navParams.get("isShared");
  }


  ngOnInit() {
  }


  public async showInfo() {
    if (!this.isShared) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Información',
        message: '<p>Creado: ' + this.time.timeSince(this.nota.date_creation) + '</p>Últ. vez modificado: ' + this.time.timeSince(this.nota.date),
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
          }
        ]
      });
      await alert.present();
    } else {
      if (this.usersShared == undefined || this.usersShared.length == 0) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Información',
          message: '<p>Creado por: ' + this.nota.user + '</p>Últ. vez modificado: ' + this.time.timeSince(this.nota.date) + '<p>Creado: ' + this.time.timeSince(this.nota.date_creation) + "</p>",
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              cssClass: 'secondary',
            }
          ]
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Información',
          message: '<p>Compartido con: ' + this.usersShared + '</p>Creado por: ' + this.nota.user + '<p>Últ. vez modificado: ' + this.time.timeSince(this.nota.date) + '</p>Creado: ' + this.time.timeSince(this.nota.date_creation),
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              cssClass: 'secondary',
            }
          ]
        });
        await alert.present();
      }

    }



  }
  public async unShareNoteAll() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dejar de compartir',
      message: '¿Desea dejar de compartir la nota con todos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: async () => {
            this.http.unShareNoteAll(this.nota.id).then(async (data) => {
              let dat = JSON.parse(data.data);
              if (dat.status == "1") {
                await this.toast.presentToast("Se ha dejado de compartir con todos", "success");
                this.usersShared = [];
                await this.popover.dismiss();
                await this.modal.dismiss();
              } else {
                await this.toast.presentToast("No se ha podido dejar de compartir con todos", "danger");
              }
            }).catch(async (err) => {
              await this.toast.presentToast("No se ha podido dejar de compartir con todos", "danger");
            })
          }
        }
      ]
    });
    await alert.present();
  }

  public async showChangeTitle() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar título',
      message: 'Introduce el nuevo título de la nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.http.updateNoteTitle(data.title, this.nota.id).then(async (data) => {
              let dat = JSON.parse(data.data);
              if (dat.status == "1") {
                await this.toast.presentToast("Título cambiado con éxito", "success");
              } else {
                await this.toast.presentToast("No se ha podido cambiar el título de la nota", "danger");
              }
            }).catch(async (err) => {
              await this.toast.presentToast("No se ha podido cambiar el título de la nota", "danger");
            })
          }
        }
      ]
    });
    await alert.present();
  }

  public check(user: string) {
    let flag = false;
    if (this.usersShared != undefined || this.usersShared.length != 0) {
      this.usersShared.forEach(element => {
        if (element == user) {
          flag = true;
        }
      });
    }
    return flag;
  }

  public async showUnShareNoteTo() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dejar de compartir',
      message: 'Introduce el nombre de la persona a la que quieres dejar de compartir la nota',
      inputs: [
        {
          name: 'user',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: async (data) => {
            this.unShareNote(data.user, true);
          }
        }
      ]
    });
    await alert.present();
  }

  public async unShareNote(user: string, flag:boolean) {
    if (this.owner && this.user.name == user) {
      await this.toast.presentToast("No puedes dejar de compartir la nota contigo mismo", "danger");
    } else {
      this.http.unShareNoteTo(this.nota.id, user).then(async (data) => {
        let dat = JSON.parse(data.data);
        if (dat.status == "1") {
          await this.toast.presentToast("Se ha dejado de compartir la nota con éxito", "success");
          const i = this.usersShared.indexOf(user);
          this.usersShared.splice(i, 1);
          if(flag){
            await this.popover.dismiss();
          } else {
            await this.popover.dismiss();
            await this.modal.dismiss();
          }
        } else {
          await this.toast.presentToast("No se ha podido dejar de compartir la nota", "danger");
        }
      }).catch((err) => {

      })
    }
  }


  public async showShareNote() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Compartir nota',
      message: 'Introduce el nombre de la persona a la que quieres compartir la nota',
      inputs: [
        {
          name: 'user',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: async (data) => {
            if (data.user == this.user.name) {
              await this.toast.presentToast("No lo puedes compartir contigo mismo", "danger");
            } else {
              if (this.check(data.user)) {
                await this.toast.presentToast("El usuario ya comparte la nota", "danger");
              } else {
                this.http.shareNote(this.nota.id, data.user).then(async (data2) => {
                  let dat = JSON.parse(data2.data);
                  if (dat.status == "1") {
                    await this.toast.presentToast("Nota compartida con éxito", "success");
                    this.usersShared.push(data.user);
                    await this.popover.dismiss();
                  } else {
                    await this.toast.presentToast("No se ha podido compartir la nota", "danger");
                  }
                }).catch(async (err) => {
                  await this.toast.presentToast("No se ha podido compartir la nota", "danger");
                })
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }





}
