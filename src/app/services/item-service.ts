import { item } from '../models/models';
import { Injectable } from '@angular/core';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';
import {File, FileEntry} from '@ionic-native/file/ngx';

const STORAGE_KEY = 'my_items';

@Injectable({
    providedIn: 'root',
})
export class ItemService {

    constructor(
        private storage: Storage, private webview: WebView, private file: File) {
    }

    pathForImage(img) {
        if(img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

    private items: item[] = [
        { id: 0, name: 'camera', image: 'https://picsum.photos/200?random=1', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'kitchen'], barcode: "", serialNumber: "", documents: [] },
        { id: 1, name: 'name', image: 'https://picsum.photos/200?random=2', filePath: "", description: "desc", price: 0, categories: ['special', 'kitchen', 'electronics'], barcode: "", serialNumber: "", documents: [] },
        { id: 2, name: 'tester', image: 'https://picsum.photos/200?random=3', filePath: "", description: "desc", price: 0, categories: ['test1', 'replace', 'furnature'], barcode: "", serialNumber: "", documents: [] },
        { id: 3, name: 'wife', image: 'https://picsum.photos/200?random=4', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'replace'], barcode: "", serialNumber: "", documents: [] },
        { id: 4, name: 'more', image: 'https://picsum.photos/200?random=5', filePath: "", description: "desc", price: 0, categories: ['test1', 'insure', 'indoor'], barcode: "", serialNumber: "", documents: [] },
        { id: 5, name: 'wifes', image: 'https://picsum.photos/200?random=6', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'personal'], barcode: "", serialNumber: "", documents: [] },
        { id: 6, name: 'kaer', image: 'https://picsum.photos/200?random=7', filePath: "", description: "desc", price: 0, categories: ['test1', 'special', 'furnature'], barcode: "", serialNumber: "", documents: [] },
        { id: 7, name: 'camera', image: 'https://picsum.photos/200?random=8', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'linnen'], barcode: "", serialNumber: "", documents: [] },
        { id: 8, name: 'name', image: 'https://picsum.photos/200?random=9', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'clothing'], barcode: "", serialNumber: "", documents: [] },
    ]

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

    public async saveItem(item: item) {
        if (item.id === this.items.length) {
            this.items.push(item);
        } else {
            this.items.forEach((i, index) => {
                if (i.id === item.id) this.items[index] = item;
            });
        }
        await this.storage.set(STORAGE_KEY,this.items);
    }

    public deleteItem(item: item) {
        this.items.forEach((i, index) => {
            if (i.id === item.id) this.items.splice(index, 1);
        });
    }
}