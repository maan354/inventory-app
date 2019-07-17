import { item } from '../models/models';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

    private items:item[] = [
        {id:0,name:'camera', image:'https://picsum.photos/200?random=1',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:1,name:'name',   image:'https://picsum.photos/200?random=2',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:2,name:'tester', image:'https://picsum.photos/200?random=3',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:3,name:'wife',   image:'https://picsum.photos/200?random=4',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:4,name:'more',   image:'https://picsum.photos/200?random=5',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:5,name:'wifes',  image:'https://picsum.photos/200?random=6',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:6,name:'kaer',   image:'https://picsum.photos/200?random=7',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:7,name:'camera', image:'https://picsum.photos/200?random=8',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
        {id:8,name:'name',   image:'https://picsum.photos/200?random=9',description:"desc",price:0,categories:['test1','test2','electronics'],barcode:"",serialNumber:"",documents:[]},
    ]

    public getItems() {
        return this.items;
    }

    public saveItem(item:item) {
        if(item.id === this.items.length){
            this.items.push(item);
        } else {
            this.items[item.id] = item;
        }
    }
}