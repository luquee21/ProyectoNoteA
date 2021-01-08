import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }


  public async presentToast(msg: string, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: col,
      duration: 1500,
      position: "bottom"
    });
    toast.present();
  }
}
