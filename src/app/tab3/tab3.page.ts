import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public user: Usuario;
  public themeMode;

  constructor(private authS: AuthService) {
   
  }
  ngOnInit() {
    this.user = this.authS.getUser();
  }


  public async logout() {
    await this.authS.logout();
  }

  public change($event) {
    if ($event.detail.checked) {
      document.body.classList.toggle('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

  }





}
