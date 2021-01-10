import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
      if(this.user.id != -1){
        this.router.navigate([""]);
      }
    }
  }

  public getUser() {
    return this.user;
  }

  public async login() {
    this.user = await this.storage.getItem("user")
    if (this.isLogged()) {
      this.router.navigate([""]);
    }

  }


  public isLogged(): boolean {
    if (this.user == null || this.user.id == -1) {
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
    } else {
      console.log(this.user);
      return true;
    }
  }

}
