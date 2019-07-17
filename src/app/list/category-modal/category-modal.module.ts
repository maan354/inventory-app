import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
// The modal's component of the previous chapter
import {CategoryModalPage} from './category-modal.page';
import { FormsModule } from '@angular/forms';

@NgModule({
     declarations: [
        CategoryModalPage
     ],
     imports: [
       IonicModule,
       CommonModule,
       FormsModule
     ],
     entryComponents: [
        CategoryModalPage
     ]
})
export class CategoryModalPageModule {}