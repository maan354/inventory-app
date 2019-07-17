import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { item } from '../models/models';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
export class ItemPage implements OnInit {
  public item:item;
  ngOnInit() {
  }

  public data:any;
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.item = this.router.getCurrentNavigation().extras.state.item;
  }

  public segmentChanged($event) {
    console.log($event.detail.value);
  }

  public saveItem() {
    this.router.navigate(['/home']);
  }

}
