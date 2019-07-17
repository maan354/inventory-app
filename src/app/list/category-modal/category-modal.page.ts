import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { category } from 'src/app/models/models';

@Component({
  selector: 'modal-page',
  templateUrl: './category-modal.page.html',
  styleUrls: ['./category-modal.scss'],
})
export class CategoryModalPage implements OnInit {
  @Input() category: category;
  @Input() title: string;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.log('opening : ',this.category)
  }

  async closeModal() {
    console.log('closing category:',this.category)
    await this.modalController.dismiss(this.category);
  }

}