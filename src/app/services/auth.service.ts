import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
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
    let u = null;
    try {
      u = await this.storage.getItem("user");
    } catch (err) {
      u = null;
    }
    if (u != null) {
      this.user = u;
    }
  }

  public getUser() {
    return this.user;
  }

  public async login(user: Usuario) {
    this.user = await this.storage.setItem("user", user);
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
    this.router.navigate(["login"]);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isLogged()) {
      this.router.navigate(["login"]);
      return false;
    } 
      return true;
  }

}
