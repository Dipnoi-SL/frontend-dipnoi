import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../models/token-response.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isApiUrl && this.authService.accessToken) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${this.authService.accessToken}`,
        ),
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          isApiUrl &&
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isRefreshing
        ) {
          this.isRefreshing = true;

          return this.authService.refreshTokens().pipe(
            switchMap((res: TokenResponse) => {
              this.isRefreshing = false;

              request = request.clone({
                headers: request.headers.set(
                  'Authorization',
                  `Bearer ${res.accessToken}`,
                ),
              });

              return next.handle(request);
            }),
            catchError((err) => {
              this.isRefreshing = false;

              this.authService.closeSession();

              return throwError(() => err);
            }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
