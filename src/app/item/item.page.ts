import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { item, document } from '../models/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemService } from '../services/item-service';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
// import { HttpClient } from '@angular/common/http';

import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImageHelper } from '../helpers/image-helper';
import { DocumentModalPage } from '../document-modal/document-modal.page';
import { OverlayEventDetail } from '@ionic/core';
import { Guid } from 'guid-typescript';
import { DeleteConfirmationPopover } from '../components/delete-confirmation-popover/delete-confirmation-popover';

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
export class ItemPage implements OnInit {
  public item: item;
  public selectedTab = 'info';
  public categories = ['q', 'w', 'e'];

  public coverImageUrl: string;

  async ngOnInit() {
    //TODO: make this a component
    this.coverImageUrl = await this.itemService.getImagePath(this.item.filePath);
  }

  public data: any;
  constructor(
    private router: Router,
    private itemService: ItemService,
    private imageHelper: ImageHelper,
    public modalController: ModalController,
    private deleteConfirmationPopover: DeleteConfirmationPopover
  ) {
    this.item = this.router.getCurrentNavigation().extras.state.item;
    this.itemService.getCategories().then(categories => this.categories = categories);
  }

  pathForImage(img) {
    return this.imageHelper.pathForImage(img)
  }

  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.item.filePath) {
      return `url("${this.coverImageUrl}")`;
    }
    return baseCss;
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  isValidName() {
    return !this.isEmptyOrSpaces(this.item.name)
    //and is unique
  }

  segmentChanged($event) {
    console.log($event.detail.value);
  }

  saveItem = async () => {
    await this.itemService.saveItem(this.item);
    this.router.navigate(['/home']);
  }

  async deleteItem() {
    const deleteAction = async () => {
      await this.itemService.deleteItem(this.item);
      this.router.navigate(['/home']);
    }
    await this.deleteConfirmationPopover.showPopover('item', deleteAction);
  }

  public async addImage(event) {
    event.stopPropagation();
    const oldPath = this.item.filePath;

    const callbackFunction = async (newPath) => {
      const path = await this.itemService.updateImage(oldPath, newPath);
      this.item.filePath = path;
      this.coverImageUrl = await this.itemService.getImagePath(this.item.filePath);
    }

    await this.imageHelper.getImage(callbackFunction, false);
    await this.itemService.saveItem(this.item);
  }

  public showImage(event) {
    event.stopPropagation();
    this.imageHelper.showImage(this.coverImageUrl)
  }

  async addDocument() {
    const blankDocument: document = {
      id: Guid.create(),
      itemId: this.item.id,
      name: '',
      description: '',
      filePath: ''
    }
    this.openModal('Add Document', blankDocument)
  }

  async editDocument(document: document) {
    this.openModal(`Edit ${document.name}`, document)
  }

  async openModal(title: string, input: document) {
    console.log('creating modal with document:', input)
    const modal = await this.modalController.create({
      component: DocumentModalPage,
      componentProps: {
        document: input,
        title: title
      }
    });

    modal.onDidDismiss().then((dataReturned: OverlayEventDetail<document>) => {
      console.log('closing', dataReturned)
      const document = dataReturned.data;
      if (document !== null) {
        //Check for uniqueness of the name and use it to update existing documents
        const existingItemIndex = this.item.documents.findIndex(i => i.id === document.id)
        if (existingItemIndex === -1)
          this.item.documents.push(document);
        else
          this.item.documents[existingItemIndex] = document;

        this.itemService.saveItem(this.item);
      }
    });

    return await modal.present();
  }
}
