import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { document } from 'src/app/models/models';
import { ImageHelper } from '../helpers/image-helper';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ItemService } from '../services/item-service';
import { DeleteConfirmationPopover } from '../components/delete-confirmation-popover/delete-confirmation-popover';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'modal-page',
  templateUrl: './document-modal.page.html',
  styleUrls: ['./document-modal.scss'],
})
export class DocumentModalPage implements OnInit {
  [x: string]: any;
  @Input() document: document;
  @Input() title: string;
  private backbuttonSubscription: Subscription;

  private coverImageUrl: string;

  constructor(
    private modalController: ModalController,
    private camera: Camera,
    private imageHelper: ImageHelper,
    private itemService: ItemService,
    private deleteConfirmationPopover: DeleteConfirmationPopover
  ) { }

  // @HostListener('document:ionBackButton', ['$event'])
  // private async overrideHardwareBackAction($event: any) {
  //   await this.closeModal(null);
  // }

  //Add document scanner rather than normal camera: https://ionicframework.com/docs/native/document-scanner
  //Add document viewer

  async ngOnInit() {
    console.log('opening : ', this.document);
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      const modal = await this.modalController.getTop();

      if (modal) {
        modal.dismiss(null);
      }
    });

    this.coverImageUrl = await this.itemService.getImagePath(this.document.filePath);

  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.document.filePath) {

      return `url("${this.coverImageUrl}")`;
    }
    return baseCss;
  }

  public showImage(event) {
    event.stopPropagation();
    this.imageHelper.showImage(this.coverImageUrl)
  }

  public async addImage(event) {
    event.stopPropagation();

    const oldPath = this.document.filePath;
    const callbackFunction = async (newPath) => {
      const path = await this.itemService.updateImage(oldPath, newPath);
      this.document.filePath = path;
      this.coverImageUrl = await this.itemService.getImagePath(this.document.filePath);

    };

    await this.imageHelper.getImage(callbackFunction, false);
    //this.itemService.saveItem(this.item);

    //Update cover image
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  isValidName() {
    return !this.isEmptyOrSpaces(this.document.name)
    //and is unique
  }

  async closeModal(document: document) {
    console.log('closing document:', document)
    await this.modalController.dismiss(document);
  }

  async deleteDocument() {
    const deleteAction = () => {
      this.itemService.deleteItemDocument(this.document);
      this.closeModal(null);
    }
    await this.deleteConfirmationPopover.showPopover('document', deleteAction);
  }

}