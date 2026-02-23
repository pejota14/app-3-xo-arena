import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdsService } from '../../services/ads/ads.service';
import { GDPR_STRINGS } from './gdpr-section.strings';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gdpr-section',
    templateUrl: './gdpr-section.component.html',
    imports: [
        CommonModule,
        TranslateModule
    ],
    styleUrls: ['./gdpr-section.component.css']
})
export class GdprSectionComponent {
    title: string = '';
    barList: {
        title: string,
        content: string
    }[] = [];
    contactEmail: string = 'support@pejota.xyz';


    constructor(
        private router: Router,
        private ads: AdsService,
    ) {
        this.title = GDPR_STRINGS.TITLE;
        this.barList = GDPR_STRINGS.SECTIONS;
        this.barList.forEach((bar) => {
            bar.content = bar.content.replace('%s', this.contactEmail);
        });
    }

    onClick() {
        this.router.navigate(['/']);
        if (this.ads.bannerShown) {
            this.ads.hideBanner();
        }
    }
}
