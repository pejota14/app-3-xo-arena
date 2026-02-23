import { Routes } from '@angular/router';
import { GdprSectionComponent } from './components/gdpr-section/gdpr-section.component';
import { HomeWebComponent } from './components/home-web/home-web.component';

export const routes: Routes = [
    {
        path: "gdpr",
        component: GdprSectionComponent
    }
];

export const webRoutes: Routes = [
    {
        path: "",
        component: HomeWebComponent
    },
    {
        path: "gdpr",
        component: GdprSectionComponent
    }
];
