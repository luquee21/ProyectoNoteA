import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/user';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public user: Usuario;

  constructor(private authS: AuthService, private language:LanguageService) {
   
  }
  ngOnInit() {
    this.user = this.authS.getUser();
  }


  public async logout() {
    await this.authS.logout();
  }

 public switchLanguage($event) {
    this.language.setLanguage($event.target.value);
  }

  public change($event) {
    if ($event.detail.checked) {
      document.body.classList.toggle('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

  }





}
