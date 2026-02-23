import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home-web',
    templateUrl: './home-web.component.html',
    styleUrls: ['./home-web.component.css'],
    imports: [
        RouterModule,
        TranslateModule
    ]
})
export class HomeWebComponent {
    appStoreLink: string = '';
    playStoreLink: string = '';
}
