import { item, document } from '../models/models';
import { Injectable } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Guid } from 'guid-typescript';

const STORAGE_KEY = 'my_items';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    private items: item[];

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
        private storage: Storage, private webview: WebView, private file: File) {
    }

    public pathForImage(img: string) {
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }


    //Look at caching this data to save on loading
    public async getItems() {
        // return this.items;
        this.items = [];
        const storedItems = await this.storage.get(STORAGE_KEY);
        console.log(storedItems);
        if (storedItems) {
            this.items = storedItems;
        }

        return this.items;
    }

    //Look at caching this data to save on loading
    public getCategories() {
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
        }

        const items = this.items;
        const categories = items
            .reduceRight((a, i) => a.concat(i.categories), [])
            .filter(distinct);
        return this.defaultCategories.concat(categories);
    }

    public async saveToStorage() {
        await this.storage.set(STORAGE_KEY, this.items);
    }

    public async saveItem(item: item) {
        let itemIndex = this.items.findIndex(i => i.id === item.id)
        if (itemIndex === -1) {
            this.items.push(item);
        } else {
            this.items[itemIndex] = item;
        }
        await this.saveToStorage();
    }

    public deleteItem(item: item) {
        this.items.forEach((i, index) => {
            if (i.id === item.id) this.items.splice(index, 1);
        });
        this.saveToStorage();
    }

    public deleteItemDocument(document: document) {
        let item = this.items.find(i => i.id === document.itemId);
        item.documents.forEach((i, index) => {
            if (i.id === document.id) item.documents.splice(index, 1);
        });
        this.saveToStorage();
    }
}