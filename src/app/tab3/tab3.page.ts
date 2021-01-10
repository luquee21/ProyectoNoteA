import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Usuario } from '../model/user';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public user: Usuario;
  private flag:boolean;

  constructor(private authS: AuthService, private language:LanguageService, private theme:ThemeService) {
   
  }
  ngOnInit() {
    this.user = this.authS.getUser();
    this.flag = this.theme.getTheme();
  }


  public async logout() {
    await this.authS.logout();
  }

 public switchLanguage($event) {
    this.language.setLanguage($event.target.value);
  }

  public async change($event) {
    if ($event.detail.checked) {
      this.theme.enableDark(true);
    } else {
      this.theme.enableDark(false);
    }

  }





}
