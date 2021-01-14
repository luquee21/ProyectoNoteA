import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { LoadingService } from '../services/loading.service';
import { ModalService } from '../services/modal.service';
import { TimeService } from '../services/time.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit{
  @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;
  private listaNotas = [];
  private listaNotasCopy: any;
  private flag = false;
  private page:number = 0;

  constructor(
    private modal: ModalService,
    private loading: LoadingService,
    private http: HttpService,
    private auth: AuthService,
    private time: TimeService) {
  }

  ngOnInit(): void {
    this.cargaDatos(null, true);
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

    public async cargaDatos($event?, reload?) {
      if (!$event) {
        await this.loading.presentLoading();
      }
      
      if(reload){
        this.ionInfiniteScroll.disabled = false;
        this.page = 1;
        this.listaNotas = [];
      } else {
        this.page = this.page + 1;
        console.log("PAG " + this.page);
      }

      this.http.getAllNotesShared(this.auth.getUser().id, this.page).then(async (data) => {
        let dat = JSON.parse(data.data);
        if (dat.status == 1) {
            dat.result.forEach(element => {
              let nota = {
                ...element
              }
              console.log(nota);
              this.listaNotas.push(nota);
            });

          this.listaNotasCopy = this.listaNotas;
          this.flag = false;
        } else if (dat.status == 2) {
          //Si el usuario no tenia notas muestro el texto de no tienes notas
          if(this.listaNotas == []){
            this.flag = true;
          }
          this.ionInfiniteScroll.disabled = true;
        }

        //Sirve para ocultar el loading de ioninfinite o ionrefresh
        if($event){
          $event.target.complete();
        } 

        await this.loading.cancelLoading();
      }).catch(async (err) => {
        await this.loading.cancelLoading();

         //Sirve para ocultar el loading de ioninfinite o ionrefresh
        if($event){
          $event.target.complete();
        }
        this.ionInfiniteScroll.disabled = true;
      })
  }


  public async editaNota(nota: Nota) {
    await this.modal.editaNota(nota,this.auth.getUser());
  }

}


