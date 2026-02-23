import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes, webRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/front/base.environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(environment.isWeb ? webRoutes : routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '../i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en'
    })
  ]
};
