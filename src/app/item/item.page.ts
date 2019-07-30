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

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
export class ItemPage implements OnInit {
  [x: string]: any;
  public item: item;
  public selectedTab = 'info';
  ngOnInit() {
  }

  public data: any;
  constructor(
    private router: Router,
    private camera: Camera,
    private itemService: ItemService,
    private actionSheetController: ActionSheetController,
    private imageHelper: ImageHelper,
    public modalController: ModalController
  ) {
    this.item = this.router.getCurrentNavigation().extras.state.item;
  }

  pathForImage(img) {
    return this.imageHelper.pathForImage(img)
  }

  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.item.filePath) {

      return `url("${this.pathForImage(this.item.filePath)}")`;
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

  public segmentChanged($event) {
    console.log($event.detail.value);
  }

  public saveItem() {
    this.itemService.saveItem(this.item);
    this.router.navigate(['/home']);
  }

  public deleteItem() {
    this.itemService.deleteItem(this.item);
    this.router.navigate(['/home']);
  }

  public async addImage() {
    await this.imageHelper.getImage((path) => { this.item.filePath = path; }, false);
    // await this.imageHelper.takePicture(this.camera.PictureSourceType.CAMERA,(path) => {this.item.filePath = path; },false);
    // await this.imageHelper.takePicture(this.camera.PictureSourceType.CAMERA,(path) => {this.item.description = path; },false);
    this.itemService.saveItem(this.item);
  }

  async addDocument() {
    const blankDocument: document = {
      id: Guid.create(),
      itemId: this.item.id,
      name: '',
      description: '',
      image: '',
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
