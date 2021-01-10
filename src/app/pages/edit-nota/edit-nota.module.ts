import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditNotaPageRoutingModule } from './edit-nota-routing.module';

import { EditNotaPage } from './edit-nota.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    EditNotaPageRoutingModule
  ],
  declarations: [EditNotaPage]
})
export class EditNotaPageModule {}
