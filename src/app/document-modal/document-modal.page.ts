import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { document } from 'src/app/models/models';
import { ImageHelper } from '../helpers/image-helper';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ItemService } from '../services/item-service';

@Component({
  selector: 'modal-page',
  templateUrl: './document-modal.page.html',
  styleUrls: ['./document-modal.scss'],
})
export class DocumentModalPage implements OnInit {
  [x: string]: any;
  @Input() document: document;
  @Input() title: string;

  constructor(
    private modalController: ModalController,
    private camera: Camera,
    private imageHelper: ImageHelper,
    private itemService: ItemService
  ) { }

  //Add document scanner rather than normal camera: https://ionicframework.com/docs/native/document-scanner
  //Add document viewer


  ngOnInit() {
    console.log('opening : ', this.document)
  }

  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.document.filePath) {

      return `url("${this.imageHelper.pathForImage(this.document.filePath)}")`;
    }
    return baseCss;
  }

  public async addImage() {
    // this.imageHelper.getImage((path) => {this.document.filePath = path; });
    this.imageHelper.getImage((path) => { this.document.filePath = path; }, false);
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  isValidName() {
    return !this.isEmptyOrSpaces(this.document.name)
    //and is unique
  }

  async closeModal(document: document) {
    console.log('closing category:', document)
    await this.modalController.dismiss(document);
  }

  deleteDocument() {
    this.itemService.deleteItemDocument(this.document);
    this.closeModal(null);
  }

}