import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

const LNG_KEY='SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  selected= '';
  lang:any;

  constructor(private translate: TranslateService, private storage:Storage) {

   }
   setInitialAppLanguage(){
     let language=this.translate.getBrowserLang();
     this.translate.setDefaultLang(language);

     this.storage.get(LNG_KEY).then(val=>{
       if(val){
         this.setLanguage(val);
         this.selected=val;
       }
     });
   }

   setLanguage(lng){
     this.translate.use(lng);
     this.selected=lng;
     this.storage.set(LNG_KEY, lng);
   }
}
