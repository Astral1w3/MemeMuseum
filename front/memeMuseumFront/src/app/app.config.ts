import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(),
      //serve a collegare i dati dell'url alle variabili @input del component
      //fa il binding in automatico es: path: 'post/:id' con @Input() id
     provideRouter(routes, withComponentInputBinding())
    ]
};
