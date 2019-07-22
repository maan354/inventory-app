import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
// The modal's component of the previous chapter
import {DocumentModalPage} from './document-modal.page';
import { FormsModule } from '@angular/forms';

@NgModule({
     declarations: [
      DocumentModalPage
     ],
     imports: [
       IonicModule,
       CommonModule,
       FormsModule
     ],
     entryComponents: [
      DocumentModalPage
     ]
})
export class DocumentModalPageModule {}