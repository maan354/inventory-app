import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';
import { AmplifyAngularModule, AmplifyIonicModule, AmplifyService } from 'aws-amplify-angular'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmplifyAngularModule,
    AmplifyIonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsPage
      }
    ])
  ],
  declarations: [SettingsPage],
  providers: [AmplifyService]
})
export class SettingsPageModule { }
