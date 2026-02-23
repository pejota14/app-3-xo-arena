import { Component, OnInit } from '@angular/core';
import { AdsService } from './services/ads/ads.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'open-counter';

  constructor(
    private ads: AdsService
  ) { }

  async ngOnInit() {
    await this.ads.initializeAdMob();
    await this.ads.requestConsent();

    await this.ads.showBanner();
  }
}
