import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { EditNotaPage } from './pages/edit-nota/edit-nota.page';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GpsService } from './services/gps.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingService } from './services/loading.service';
import { ToastService } from './services/toast.service';
import { PopoverComponent } from './components/popover/popover.component';
import { HttpService } from './services/http.service';
import { HTTP } from '@ionic-native/http/ngx';
import { AuthService } from './services/auth.service';
import { NotePage } from './pages/note/note.page';
import { ModalService } from './services/modal.service';





@NgModule({
  declarations: [AppComponent,EditNotaPage, PopoverComponent, NotePage],
  entryComponents: [EditNotaPage],
  imports: [
    BrowserModule, 
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [
    HTTP,
    StatusBar,
    ModalService,
    SplashScreen,
    HttpService,
    LoadingService,
    ToastService,
    NativeStorage,
    AuthService,
    GpsService,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
