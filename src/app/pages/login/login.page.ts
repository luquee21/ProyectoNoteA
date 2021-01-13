import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private user: Usuario;
  public tasks: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private storage: NativeStorage,
    private modalController: ModalController,
    private authService: AuthService,
    private http: HttpService,
    private alertService: ToastService,
    private loading: LoadingService) {
    this.tasks = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit() {
    
  }



  public async login() {
    await this.loading.presentLoading();
      this.http.getUser(this.tasks.get('email').value, this.tasks.get('password').value).then(async (data) => {
      if (data) {
        let dat = JSON.parse(data.data);
        if (dat.status == "1") {
          // user exists
          this.user = {
            id: dat.result.id,
            email: this.tasks.get('email').value,
            name: dat.result.user
          }
          this.authService.login(this.user);
        } else {
          // user doesn't exist
          this.user = {
            id: -1,
            email: ''
          }
          this.alertService.presentToast("El usuario no existe, compruebe los datos", "danger");
        }
      }
      await this.loading.cancelLoading();
    }).catch(async (err) => {
      this.user = {
        id: -1,
        email: ''
      }
      await this.loading.cancelLoading();
      console.log(err);
    })

  }

  public async registerModal() {
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

}
