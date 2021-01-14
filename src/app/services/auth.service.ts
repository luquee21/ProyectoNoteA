import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { VirtualTimeScheduler } from 'rxjs';
import { Usuario } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Usuario = {
    id: -1,
    email: ''
  }

  constructor(
    private storage: NativeStorage,
    private router: Router) {

  }

  async init() {
    let u:Usuario = null;
    try {
      u = await this.storage.getItem("user");
    console.log("Getting user from init");
    console.log(u.id);
    } catch (err) {
      u = null;
    }
    if (u != null) {
      this.user = u;
      //añado este autologin porque en mi movil tengo un bug que el canactivate se ejecuta antes que esta funcion y no me autologuea
      if(this.user.id != -1){
        this.router.navigate(["/"]);
      }
    }
  }

  public getUser() {
    return this.user;
  }

  public async login(user: Usuario) {
    this.user = await this.storage.setItem("user", user);
    console.log("LOGIN");
    console.log(this.user.id);
    this.router.navigate(["/"]);
  }


  public isLogged(): boolean {
    if (this.user.id == -1) {
      return false;
    } else {
      return true;
    }
  }

  public async logout() {
    this.user = {
      id: -1,
      email: ''
    }
    await this.storage.setItem("user", this.user);
    console.log("LOGOUT");
    console.log(this.user.id);
    this.router.navigate(["login"]);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log("canactivate " + this.isLogged());
    if (!this.isLogged()) {
      this.router.navigate(["login"]);
      return false;
    } 
      return true;
  }

}
