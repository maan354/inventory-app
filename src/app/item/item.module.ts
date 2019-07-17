import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ItemPage } from './item.page';

import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagInputModule,
    RouterModule.forChild([
      {
        path: '',
        component: ItemPage
      }
    ])
  ],
  declarations: [ItemPage]
})
export class ItemPageModule {}
