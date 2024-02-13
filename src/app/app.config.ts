import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideIcons } from '@ng-icons/core';
import {
  matAccessibleForwardOutline,
  matAccountCircleOutline,
  matTuneOutline,
  matVisibilityOffOutline,
  matVisibilityOutline,
  matThumbUpOutline,
  matThumbDownOutline,
  matChatOutline,
  matStarOutlineOutline,
} from '@ng-icons/material-icons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideIcons({
      matAccountCircleOutline,
      matVisibilityOffOutline,
      matVisibilityOutline,
      matTuneOutline,
      matAccessibleForwardOutline,
      matThumbUpOutline,
      matThumbDownOutline,
      matChatOutline,
      matStarOutlineOutline,
    }),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
