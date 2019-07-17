import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { item } from '../models/models';
import { ItemService } from '../services/item-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public searchTerm: string = ''
  
  public filteredItems;
  public items;

  constructor(private router: Router, private _itemService:ItemService) {
    this.items = this._itemService.getItems();
    this.filteredItems = this.items;
  }
  
  filterItems(searchTerm) {
      return this.items.filter(item => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }
  //https://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
  setFilteredItems() {
    this.filteredItems = this.filterItems(this.searchTerm);
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
      id:this.items.length,name:'', image:'',description:"",price:0,categories:[],barcode:"",serialNumber:"",documents:[]
    };
    let navigationExtras: NavigationExtras = {
      state: {
        item: blankItem
      }
    };
    console.log('send',blankItem)
    this.router.navigate(['/item'], navigationExtras);
  }

}
