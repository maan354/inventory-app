import { item, document } from '../models/models';
import { Injectable } from '@angular/core';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';
import {File, FileEntry} from '@ionic-native/file/ngx';
import { Guid } from 'guid-typescript';

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
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'camera', image: 'https://picsum.photos/200?random=1', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'kitchen'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'name', image: 'https://picsum.photos/200?random=2', filePath: "", description: "desc", price: 0, categories: ['special', 'kitchen', 'electronics'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'tester', image: 'https://picsum.photos/200?random=3', filePath: "", description: "desc", price: 0, categories: ['test1', 'replace', 'furnature'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'wife', image: 'https://picsum.photos/200?random=4', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'replace'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'more', image: 'https://picsum.photos/200?random=5', filePath: "", description: "desc", price: 0, categories: ['test1', 'insure', 'indoor'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'wifes', image: 'https://picsum.photos/200?random=6', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'personal'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'kaer', image: 'https://picsum.photos/200?random=7', filePath: "", description: "desc", price: 0, categories: ['test1', 'special', 'furnature'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'camera', image: 'https://picsum.photos/200?random=8', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'linnen'], barcode: "", serialNumber: "", documents: [] },
        { id: Guid.create(),thumbPath:'https://picsum.photos/200?random=1', name: 'name', image: 'https://picsum.photos/200?random=9', filePath: "", description: "desc", price: 0, categories: ['test1', 'test2', 'clothing'], barcode: "", serialNumber: "", documents: [] },
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

    public async saveToStorage(){
        await this.storage.set(STORAGE_KEY,this.items);
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