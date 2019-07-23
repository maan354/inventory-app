import { Component } from '@angular/core';

@Component({
  selector: 'SlidesPage',
  templateUrl: 'slides.page.html',
  styleUrls:['slides.page.scss']
})
export class SlidesPage {
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor() {}
}