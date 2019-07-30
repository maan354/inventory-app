import { item } from '../models/models';
import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Platform, ActionSheetController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';

const STORAGE_KEY = 'my_items';

@Injectable({
    providedIn: 'root',
})
export class ImageHelper {

    constructor(
        private storage: Storage,
        private webview: WebView,
        private file: File,
        private camera: Camera,
        private platform: Platform,
        private filePath: FilePath,
        private actionSheetController: ActionSheetController,
        private crop: Crop
    ) {
    }

    public pathForImage(img: string) {
        //return img; //MOCK
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

    // public pathForImage(url: string): string | SafeUrl {
    //     if (this.platform.is('cordova')) {
    //         const win: any = window;
    //         const fixedURL = win.Ionic.WebView.convertFileSrc(url);

    //         const securityContext:  SecurityContext = {

    //         }
    //         return this.sanitizer.sanitize(securityContext,fixedURL);//.bypassSecurityTrustUrl();
    //     } else {
    //         return url;
    //     }
    // }

    public async getImage(assignFunction: (path: string) => void, crop: boolean = true) {
        const actionSheet = await this.actionSheetController.create({
            header: "Select Image source",
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, assignFunction);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA, assignFunction, crop);
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

    public takePicture(sourceType: PictureSourceType, assignFunction: (path: string) => void, crop: boolean = true) {
        //MOCK
        // const rand = (Math.ceil(Math.random() * 10))
        // assignFunction(`https://picsum.photos/200?random=${rand}`);
        // return;

        var options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            //destinationType: this.camera.DestinationType.DATA_URL,
            destinationType: this.camera.DestinationType.NATIVE_URI,
            targetHeight: 600,
            targetWidth: 600,
            //encodingType: this.camera.EncodingType.JPEG
        };

        this.camera.getPicture(options).then(imagePath => {
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                console.log("resolving picture from library")
                // this.filePath.resolveNativePath(imagePath)
                //     .then(filePath => {
                //         let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                //         let currentName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('?'));
                //         this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), assignFunction);
                //         // assignFunction(filePath);

                //     }).catch(error => assignFunction("something went wrong:" + JSON.stringify(error)));
                let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), assignFunction);

            } else {
                if (crop) {
                    this.crop.crop(imagePath, { targetHeight: 1000, targetWidth: 1000 })
                        .then(newImage => {
                            var currentName = newImage.substr(newImage.lastIndexOf('/') + 1);
                            var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
                            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), assignFunction);
                        })
                        .catch(error => assignFunction(error));
                } else {
                    var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                    var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), assignFunction);
                }
            }
        })
    }

    createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    copyFileToLocalDir(namePath, currentName, newFileName, assignFunction: (path: string) => void) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            assignFunction(this.file.dataDirectory + newFileName);
        }, error => {
            assignFunction("something went wrong:" + JSON.stringify(error));
        });
    }

    scanDocument() {
        return 'https://picsum.photos/200?random=1';
    }

    scanBarcode() {
        return 12345;
    }
    // https://ionicacademy.com/create-thumbnail-image-ionic/
    // generateThumbnail() {
    //     this.generateFromImage(this.bigImg, 200, 200, 0.5, data => {
    //         this.smallImg = data;
    //         this.smallSize = this.getImageSize(this.smallImg);
    //       });
    // }

    // generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    //     var canvas: any = document.createElement("canvas");
    //     var image = new Image();

    //     image.onload = () => {
    //       var width = image.width;
    //       var height = image.height;

    //       if (width > height) {
    //         if (width > MAX_WIDTH) {
    //           height *= MAX_WIDTH / width;
    //           width = MAX_WIDTH;
    //         }
    //       } else {
    //         if (height > MAX_HEIGHT) {
    //           width *= MAX_HEIGHT / height;
    //           height = MAX_HEIGHT;
    //         }
    //       }
    //       canvas.width = width;
    //       canvas.height = height;
    //       var ctx = canvas.getContext("2d");

    //       ctx.drawImage(image, 0, 0, width, height);

    //       // IMPORTANT: 'jpeg' NOT 'jpg'
    //       var dataUrl = canvas.toDataURL('image/jpeg', quality);

    //       callback(dataUrl)
    //     }
    //     image.src = img;
    //   }

    // getImageSize(data_url) {
    //     var head = 'data:image/jpeg;base64,';
    //     return ((data_url.length - head.length) * 3 / 4 / (1024*1024)).toFixed(4);
    //   }
}