import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { item } from '../models/models';
import { ItemService } from '../services/item-service';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  [x: string]: any;
  public searchTerm: string = ''
  
  public filteredItems = [];
  public items = [];

  constructor(private router: Router, private _itemService:ItemService, private webview: WebView,) {
    this._itemService.getItems().then(items => {
      this.items = items;
      this.filteredItems = items;
    });
  }
  
  stringContainsTerm(inputString:string,term:string){
    return inputString.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  filterItems(searchTerm:string) {
    if(!searchTerm)
      return this.items;

    let searchTerms = searchTerm.split(' ');
      return this.items.filter((item:item) => {
        return searchTerms.every((term:string) => {
          return this.stringContainsTerm(item.name,term) || 
                (item.categories.find(s => this.stringContainsTerm(s,term)) != undefined);
        });
      });
  }
  //https://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
  setFilteredItems() {
    this.filteredItems = this.filterItems(this.searchTerm);
    console.log(this.filteredItems)
  }

  openDetailsWithState(item:item) {
    console.log('send',item)
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['/item'], navigationExtras);
  }

  createNewItem() {
    let blankItem:item = {
      id:this.items.length,name:'', image:'',filePath:'',description:"",price:0,categories:[],barcode:"",serialNumber:"",documents:[]
    };
    let navigationExtras: NavigationExtras = {
      state: {
        item: blankItem
      }
    };
    console.log('send',blankItem)
    this.router.navigate(['/item'], navigationExtras);
  }

  //move to helper class
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
}
