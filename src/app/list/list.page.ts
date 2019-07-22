import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryModalPage } from './category-modal/category-modal.page';
import { OverlayEventDetail } from '@ionic/core';
import { category } from '../models/models';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];

  public items: category[] = [];
  constructor(public modalController: ModalController) {
    for (let i = 0; i < 10; i++) {
      this.items.push({
        id: Guid.create(),
        name: 'Item ' + i,
        description: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)],
        image:''
      });
    }
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }


  async createCategory() {
    const blankCategory:category = {
      id: Guid.create(),
      name: '',
      description: '',
      icon: '',
      image:''
    }
    this.openModal('Create new Category',blankCategory)
  }

  async editCategory(id:number) {
    const category = this.items[id];
    this.openModal(`Edit ${category.name}`,category)
  }

  async openModal(title:string, input:category) {
    console.log('creating modal with cat:',input)
    const modal = await this.modalController.create({
      component: CategoryModalPage,
      componentProps: {
        category:input,
        title: title
      }
    });
 
    modal.onDidDismiss().then((dataReturned:OverlayEventDetail<category>) => {
      console.log('closing',dataReturned)
      const category = dataReturned.data;
      // if (category !== null) {
      //   if(category.id >= this.items.length)
      //     this.items.push(category);
      //   // else
      //   //   this.items[category.id] = category;
      // }
    });
 
    return await modal.present();
  }
}
