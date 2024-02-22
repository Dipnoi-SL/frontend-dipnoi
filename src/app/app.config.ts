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
  matDoneOutline,
  matCloseOutline,
  matPendingOutline,
} from '@ng-icons/material-icons/outline';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

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
      matDoneOutline,
      matCloseOutline,
      matPendingOutline,
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
      } as SocialAuthServiceConfig,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptchaSiteKey,
        theme: 'dark',
      } as RecaptchaSettings,
    },
  ],
};
