import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { LoadingService } from '../services/loading.service';
import { ModalService } from '../services/modal.service';
import { TimeService } from '../services/time.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit{
  private listaNotas = [];
  private listaNotasCopy: any;
  private flag = false;

  constructor(
    private modal: ModalService,
    private loading: LoadingService,
    private http: HttpService,
    private auth: AuthService,
    private time: TimeService) {
  }

  ngOnInit(): void {
    this.cargaDatos();
  }


  public filterList(evt: any) {
    const val = evt.target.value;
    this.listaNotasCopy = this.listaNotas;
    if (val && val.trim() != '') {
      this.listaNotasCopy = this.listaNotasCopy.filter((data) => {
        return (data.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  public timeSince(timeCreated){
    return this.time.timeSince(timeCreated);
    }

  public async cargaDatos($event = null) {
    if (!$event) {
    await this.loading.presentLoading();
    }
    await this.http.getAllNotesShared(this.auth.getUser().id).then(async (data) => {
      let dat = JSON.parse(data.data);
      console.log(dat);
      if (dat.status == 1) {
        this.flag = false;
        this.listaNotas = [];
        dat.result.forEach(element => {
          let nota = {
            ...element
          }
          this.listaNotas.push(nota);
          this.listaNotasCopy = this.listaNotas;
        });
       
      } else if (dat.status == 2) {
        this.flag = true;
      }
      if ($event) {
        $event.target.complete();
      }
      await this.loading.cancelLoading();
    }).catch(async (err) => {
      await this.loading.cancelLoading();
      if ($event) {
        $event.target.complete();
      }
    })
  }

  public async editaNota(nota: Nota) {
    await this.modal.editaNota(nota,this.auth.getUser());
  }

}


