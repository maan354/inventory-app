import { item, document } from '../models/models';
import { Injectable, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Guid } from 'guid-typescript';
import Amplify, { Storage as AWSStorage } from 'aws-amplify';
import { AuthGuardService } from './auth-route-guard';

const STORAGE_KEY = 'my_items';
const CLOUD_STORAGE_KEY = 'inventory.json'

@Injectable({
    providedIn: 'root',
})
export class ItemService implements OnInit {

    private isLoggedIn = true; //TODO THIS FUCKING THING DOES NOT WORK AS EXPECTED

    //keep state in order to prevent continuous loading 
    private localItems: item[];

    ngOnInit(): void {

    }

    //https://www.iii.org/article/brochure-home-inventory
    private defaultCategories: string[] = [
        'Decorations',
        'Electronics',
        'Appliances',
        'Furniture',
        'Vehicle',
        'Clothing',

        'Sports',
        'Curtains',
        'Crockery',
        'Linens',

        'Kitchen',
        'Living',
        'Lounge',
        'Dining',
        'Bedroom',
        'Bathroom',
        'Patio',
        'Guest',
        'Garage',
        'Study',

        'Television',
        'Camera',
        'Phone',
        'Washer',
        'Dryer',
        'Heater',
        'Fan',
        'Vacuum',
        'Exercise',

        'Rug',
        'Bookcase',
        'Table',
        'Chair',
        'Lamp',
        'Clock',
        'Mirror',
        'Vase',
        'Collection',
        'Picture',
        'Musical',
        'Sofa',
        'Couch',
        'Buffet',
        'Beds',

        'Shoe',
        'Coat',
        'Fur',
        'Suit',
        'Dress',
        'Sweater',
        'Sport',
        'Shirt',
        'Skirt',
        'Jewelry',

        'Refrigerator',
        'Freezer',
        'Stove',
        'Microwave',
        'Oven',
        'Dishwasher',
        'Pot',
        'Dishes',
        'Glass',
        'Utensil',

        'Towels',
        'Desk',
        'Computer',

        'Luggage',
        'Lawn',
        'Bicycle',
        'Garden',
        'Ladder',
        'Tool',
        'Holiday',
        'Planter',

        'Braai',

        'Book',
    ]
    constructor(
        private storage: Storage,
        private file: File,
        private authGuardService: AuthGuardService
    ) {
        this.authGuardService.getLoginState().then(state => {
            this.isLoggedIn = state.loggedIn;
        })
    }


    public async getItems(): Promise<item[]> {
        console.log('getting items...', this.isLoggedIn)
        if (this.localItems)
            return this.localItems;

        if (this.isLoggedIn) {
            try {
                this.localItems = await this.getInventoryFromCloud();
            } catch (error) {
                this.localItems = [];
            }
            return this.localItems;
        } else {
            this.localItems = await this.getItemsLocalStorage();
            return this.localItems;
        }
    }

    public async getCategories() {
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
        }

        const items = await this.getItems();
        const categories = items
            .reduceRight((a, i) => a.concat(i.categories), [])
            .filter(distinct);
        return this.defaultCategories.concat(categories);
    }

    public async saveInventory(items) {
        this.localItems = this.localItems;
        if (this.isLoggedIn) {
            return await this.saveInventoryToCloud(items);
        } else {
            return await this.saveInventoryToStorageLocal(items);
        }
    }

    public async saveItem(item: item) {
        const items = await this.getItems();
        console.log('saving', items)
        console.log('saving', item)
        let itemIndex = items.findIndex(i => item.id.toString() === i.id.toString())
        if (itemIndex === -1) {
            console.log('pushing new item')
            items.push(item);
        } else {
            console.log('over writing old item')
            items[itemIndex] = item;
        }
        await this.saveInventory(items);
    }

    public async deleteItem(item: item) {
        let items = await this.getItems();
        console.log('before deleting', items)
        items.forEach((i, index) => {
            if (i.id.toString() === item.id.toString()) items.splice(index, 1);
        });

        console.log('after deleting', items)

        if (this.isLoggedIn) {
            //Delete images
            await this.deleteImageFromCloud(item.filePath);
            item.documents.forEach(doc => this.deleteImageFromCloud(doc.filePath));
            console.log('saving to cloud', items)

            return await this.saveInventoryToCloud(items);
        } else {
            return await this.saveInventoryToStorageLocal(items);
        }
    }

    public async deleteItemDocument(document: document) {
        const items = await this.getItems();
        let item = items.find(i => i.id === document.itemId);
        item.documents.forEach((i, index) => {
            if (i.id === document.id) item.documents.splice(index, 1);
        });
        if (this.isLoggedIn) {
            //Delete images in cloud
            await this.deleteImageFromCloud(document.filePath);

            return await this.saveInventoryToCloud(items);
        } else {
            return await this.saveInventoryToStorageLocal(items);
        }
    }

    public async updateImage(oldImage, newImage) {
        console.log("updating image...", oldImage, 'to', newImage)
        if (this.isLoggedIn) {
            return await this.uploadNewImageToCloud(oldImage, newImage)
        } else {
            return newImage
        }
    }

    public async getImagePath(imagePath) {
        console.log('image path', imagePath)
        //could be a local image

        //could be a cloud image
        const result = await AWSStorage.get(imagePath, { level: 'private', download: false });
        //console.log('result from loading image from cloud', result);
        return <string>result;
    }










    //Look at caching this data to save on loading
    public async getItemsLocalStorage() {
        const storedItems = await this.storage.get(STORAGE_KEY);
        console.log(storedItems);
        return storedItems;
    }

    //TODO: Figure this one out
    public async saveInventoryToStorageLocal(items) {
        await this.storage.set(STORAGE_KEY, items);
    }

    public async saveItemLocal(item: item) {
        const items = await this.getItems();
        let itemIndex = items.findIndex(i => i.id === item.id)
        if (itemIndex === -1) {
            items.push(item);
        } else {
            items[itemIndex] = item;
        }
        await this.saveInventoryToStorageLocal(items);
    }

    public async deleteItemLocal(item: item) {
        const items = await this.getItems();
        items.forEach((i, index) => {
            if (i.id === item.id) items.splice(index, 1);
        });
        this.saveInventoryToStorageLocal(items);
    }

    public async deleteItemDocumentLocal(document: document) {
        const items = await this.getItems();
        let item = items.find(i => i.id === document.itemId);
        item.documents.forEach((i, index) => {
            if (i.id === document.id) item.documents.splice(index, 1);
        });
        this.saveInventoryToStorageLocal(items);
    }

    //when deleting an item or taking a new picture, make sure to delete the old one and upload the new one









    //if logged in, save to cloud as well
    public saveInventoryToCloud(items) {
        AWSStorage.put(CLOUD_STORAGE_KEY, JSON.stringify(items), {
            level: 'private',
            contentType: 'text/json'
        })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    public async getInventoryFromCloud(): Promise<item[]> {
        const jsonFile = <{ Body: string }>await AWSStorage.get(CLOUD_STORAGE_KEY, { level: 'private', download: true });
        const inventory = <item[]>JSON.parse(jsonFile.Body.toString());
        return inventory;
    }

    public deleteImageFromCloud(imagePath) {
        AWSStorage.remove(imagePath, { level: 'private' })
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }


    public async uploadNewImageToCloud(oldImagePath, newImagePath) {
        console.log('Uploading image to cloud...');
        if (oldImagePath) {
            try {
                this.deleteImageFromCloud(this.getImageNameFromPath(oldImagePath))
            } catch (err) {
                console.log('could not delete old image:', err)
            }
        }
        const newFileName = this.getImageNameFromPath(newImagePath);
        const file = await this.loadImageIntoMemory(newImagePath);
        const result = <{ key: string }>await AWSStorage.put(newFileName, file, { level: 'private' });
        //const signedUrl = await AWSStorage.get(result.key, { level: 'private' });
        return result.key;
    }

    public syncDataFromCloud() {
        //download inventory

        //Check local directory for any images
        //Check remote for any images,
        //Download all outstanding images

    }

    private async loadImageIntoMemory(pathToImageFile) {
        const response = await fetch(pathToImageFile)
        const blob = await response.blob()
        return blob;
    }

    public getImageNameFromPath(path) {
        return path;
    }

    public getLocalPathFromImageName(path) {
        return path;
    }
}