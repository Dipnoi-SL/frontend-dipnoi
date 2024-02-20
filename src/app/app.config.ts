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
  matExpandMoreOutline,
  matVisibilityOffOutline,
  matVisibilityOutline,
  matThumbUpOutline,
  matThumbDownOutline,
  matChatOutline,
  matStarOutlineOutline,
} from '@ng-icons/material-icons/outline';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideIcons({
      matAccountCircleOutline,
      matVisibilityOffOutline,
      matVisibilityOutline,
      matExpandMoreOutline,
      matAccessibleForwardOutline,
      matThumbUpOutline,
      matThumbDownOutline,
      matChatOutline,
      matStarOutlineOutline,
    }),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              oneTapEnabled: false,
              scopes: 'https://www.googleapis.com/auth/userinfo.email',
            }),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookClientId, {
              scope: 'email',
              enable_profile_selector: true,
            }),
          },
        ],
        onError: (err: unknown) => {
          console.error(err);
        },
      },
    },
  ],
};
