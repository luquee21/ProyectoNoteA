import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/model/user';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public tasks: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private http:HttpService,
    private toast:ToastService,
    private loading:LoadingService
    ) {
      this.tasks = this.formBuilder.group({
        email: ['',Validators.required],
        password: ['',[Validators.required, Validators.minLength(6)]]
      });
     }

  ngOnInit() {
  }
  dismissRegister() {
    this.modalController.dismiss();
  }


 public async register() {
   await this.loading.presentLoading();
   let user:Usuario;
    this.http.createUser(this.tasks.get('email').value, this.tasks.get('password').value).then(async (data) => {
      console.log(data);
      if (data) {
        let dat = JSON.parse(data.data);
        console.log(dat.status);
        if (dat.status == "1") {
          // user created
          user = {
            id: dat.result,
            email: this.tasks.get('email').value
          }
          this.toast.presentToast("Usuario registrado con éxito","success");
          await this.loading.cancelLoading();
          this.dismissRegister();
        } else {
          // error creating user, probably exists
          this.toast.presentToast("Usuario ya registrado","danger");
          user = {
            id: -1,
            email: ''
          }
          await this.loading.cancelLoading();
        }
      }
    }).catch(async (err) => {
      //error
      user = {
        id: -1,
        email: ''
      }
      await this.loading.cancelLoading();
    })
  }

}
