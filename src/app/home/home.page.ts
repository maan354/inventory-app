import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { item } from '../models/models';
import { ItemService } from '../services/item-service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Guid } from "guid-typescript";
import { ImageHelper } from '../helpers/image-helper';

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

  constructor(private router: Router,
    private _itemService: ItemService,
    private imageHelper: ImageHelper) {
    this._itemService.getItems().then(items => {
      this.items = items;
      this.filteredItems = items;
      console.log(this.filteredItems)
    });
  }

  stringContainsTerm(inputString: string, term: string) {
    return inputString.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  filterItems(searchTerm: string) {
    if (!searchTerm)
      return this.items;

    let searchTerms = searchTerm.split(' ');
    return this.items.filter((item: item) => {
      return searchTerms.every((term: string) => {
        return this.stringContainsTerm(item.name, term) ||
          (item.categories.find(s => this.stringContainsTerm(s, term)) != undefined);
      });
    });
  }
  //https://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
  setFilteredItems() {
    this.filteredItems = this.filterItems(this.searchTerm);
    console.log(this.filteredItems)
  }

  openDetailsWithState(item: item) {
    console.log('send', item)
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.router.navigate(['/item'], navigationExtras);
  }

  createNewItem() {
    let blankItem: item = {
      id: Guid.create(), name: '', image: '', filePath: '', thumbPath: '', description: "", price: 0, number: 1, categories: [], barcode: "", serialNumber: "", documents: []
    };
    let navigationExtras: NavigationExtras = {
      state: {
        item: blankItem
      }
    };
    console.log('send', blankItem)
    this.router.navigate(['/item'], navigationExtras);
  }

  pathForImage(img) {
    return this.imageHelper.pathForImage(img)
  }

  displayImage(item) {
    const baseCss = "linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) )"
    if (item.filePath) {

      return `url("${this.pathForImage(item.filePath)}")`;
    }
    return baseCss;
  }
}
