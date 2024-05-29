import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  knownErrors: {
    uri: string;
    statusCode: number;
    message: string;
    title: string;
  }[] = [
    {
      uri: '/auth/sign-in',
      statusCode: 400,
      message: 'Invalid credentials.',
      title: 'Authentication Error',
    },
  ];

  constructor(private toastService: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          (!isApiUrl ||
            !(error instanceof HttpErrorResponse) ||
            error.status !== 401) &&
          !request.url.endsWith('refresh-tokens')
        ) {
          const knownError = this.getKnownErrorData(request.url, error.status);

          if (knownError) {
            this.toastService.error(knownError.message, knownError.title);
          } else {
            this.toastService.error(
              'An error has occurred. Please try again in a few minutes.',
              'Unknown Error',
            );
          }
        }

        return throwError(() => error);
      }),
    );
  }

  getKnownErrorData(url: string, statusCode: number) {
    for (const knownError of this.knownErrors) {
      if (
        statusCode === knownError.statusCode &&
        url.endsWith(knownError.uri)
      ) {
        return { message: knownError.message, title: knownError.title };
      }
    }

    return null;
  }
}
