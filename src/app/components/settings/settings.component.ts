import { Component } from '@angular/core';
import { GearComponent } from '../gear/gear.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-settings',
    imports: [
        GearComponent,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
    showSettings = false;

    openSettings() {
        this.showSettings = true;
    }

    closeSettings() {
        this.showSettings = false;
    }
}
