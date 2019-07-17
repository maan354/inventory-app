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
  
  public items = this._itemService.getItems();
  public filteredItems = this.items;
  
  constructor(private router: Router, private _itemService:ItemService) { }
  
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

}
