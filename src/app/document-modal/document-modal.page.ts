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

  ngOnInit() {
    console.log('opening : ', this.document);
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      const modal = await this.modalController.getTop();

      if (modal) {
        modal.dismiss(null);
      }
    });
  }
  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.document.filePath) {

      return `url("${this.imageHelper.pathForImage(this.document.filePath)}")`;
    }
    return baseCss;
  }

  public showImage(event) {
    event.stopPropagation();
    this.imageHelper.showImage(this.document.filePath)
  }

  public async addImage(event) {
    event.stopPropagation();
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