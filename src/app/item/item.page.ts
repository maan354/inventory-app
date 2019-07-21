import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { item } from '../models/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemService } from '../services/item-service';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {File, FileEntry} from '@ionic-native/file/ngx';
// import { HttpClient } from '@angular/common/http';

import { ActionSheetController, Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
export class ItemPage implements OnInit {
  [x: string]: any;
  public item: item;

  ngOnInit() {
  }

  //extract to image helper
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  
  displayImage() {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (this.item.filePath){
      
      return `url("${this.pathForImage(this.item.filePath)}")`;
    }
    return baseCss;
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  isValidName() {
    return this.isEmptyOrSpaces(this.item.name)
    //and is unique

  }
  public data: any;
  constructor(
    private platform: Platform,
    private filePath: FilePath,
    private route: ActivatedRoute,
    private router: Router,
    private camera: Camera,
    private file: File, 
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private actionSheetController: ActionSheetController,
    private webview: WebView,
  ) {
    this.item = this.router.getCurrentNavigation().extras.state.item;
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
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: false
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.item.image = imagePath;
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    })
    .catch(error => {this.item.description = ("top error" + error)});
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.item.filePath = this.file.dataDirectory + newFileName;
      this.item.description = this.file.dataDirectory + newFileName;
    }, error => {
      this.item.description = (error)
    });
  }

}
