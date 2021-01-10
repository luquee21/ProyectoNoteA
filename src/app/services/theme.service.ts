import { Injectable} from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private flag:boolean;  

  constructor(private storage:NativeStorage) {
  }

  public async enableDark(flag:boolean) {
    if(flag){
      document.body.classList.toggle('dark-theme');
      await this.storage.setItem("dark",true);
    } else {
      document.body.classList.remove('dark-theme');
      await this.storage.setItem("dark",false);
    }
  }

  public async setTheme(){
   this.flag =  await this.storage.getItem("dark");
   if(this.flag){
    document.body.classList.toggle('dark-theme');
   }
  }

  public getTheme(){
    return this.flag;
  }
}


