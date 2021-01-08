import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { Usuario } from '../model/user';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalController:ModalController) { }


  public async editaNota(nota: Nota, user:Usuario) {
    const modal = await this.modalController.create({
      component: EditNotaPage,
      cssClass: 'my-custom-class',
      componentProps: {
        nota: nota,
        user: user
      }
    });
    return await modal.present();
  }
}
