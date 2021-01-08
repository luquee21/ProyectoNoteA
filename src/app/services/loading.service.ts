import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading:boolean = false;
  constructor(public loadingController: LoadingController) {
   }


                                                                                        
  public async presentLoading() {
    if(!this.isLoading){
      this.isLoading = true;
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Cargando...',
        spinner: 'crescent',
        showBackdrop: false
    
      });
      await loading.present();
    }
  }

  public async cancelLoading() {
    await this.loadingController.dismiss();
    this.isLoading = false;
  }
  
}
