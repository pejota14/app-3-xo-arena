import { Routes } from '@angular/router';
import { GdprSectionComponent } from './components/gdpr-section/gdpr-section.component';
import { HomeWebComponent } from './components/home-web/home-web.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';

export const routes: Routes = [
    {
        path: "gdpr",
        component: GdprSectionComponent
    },
    {
        path: "",
        component: TicTacToeComponent
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
