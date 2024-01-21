import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenResponse } from '../models/token-response.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  signUp(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/sign-up`, {
      email,
      password,
    });
  }

  signIn(email: string, password: string) {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/sign-in`,
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      .pipe(
        concatMap((res) => {
          this.accessToken = res.accessToken;

          return this.userService.readMe();
        }),
      );
  }

  googleSignIn(accessToken: string) {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/google-sign-in`,
        {
          accessToken,
        },
        { withCredentials: true },
      )
      .pipe(
        concatMap((res) => {
          this.accessToken = res.accessToken;

          return this.userService.readMe();
        }),
      );
  }

  facebookSignIn(accessToken: string) {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/facebook-sign-in`,
        {
          accessToken,
        },
        { withCredentials: true },
      )
      .pipe(
        concatMap((res) => {
          this.accessToken = res.accessToken;

          return this.userService.readMe();
        }),
      );
  }

  signOut() {
    return this.http.delete(`${environment.apiUrl}/auth/sign-out`).pipe(
      tap({
        next: () => {
          this.closeSession();
        },
        error: () => {
          this.closeSession();
        },
      }),
    );
  }

  refreshTokens() {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/refresh-tokens`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (res) => {
            this.accessToken = res.accessToken;
          },
        }),
      );
  }

  updatePassword(newPassword: string, oldPassword: string) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/update-password`,
        {
          newPassword,
          oldPassword,
        },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (res) => {
            this.accessToken = res.accessToken;
          },
        }),
      );
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/request-password-reset`, {
      email,
    });
  }

  resetPassword(newPassword: string, resetToken: string) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/reset-password`,
        {
          newPassword,
          resetToken,
        },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (res) => {
            this.accessToken = res.accessToken;
          },
        }),
      );
  }

  requestActivation() {
    return this.http.post(`${environment.apiUrl}/auth/request-activation`, {});
  }

  activate(activationToken: string, nickname: string) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/activate`,
        {
          activationToken,
          nickname,
        },
        { withCredentials: true },
      )
      .pipe(
        concatMap((res) => {
          this.accessToken = res.accessToken;

          return this.userService.readMe();
        }),
      );
  }

  socialActivate(nickname: string) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/social-activate`,
        {
          nickname,
        },
        { withCredentials: true },
      )
      .pipe(
        concatMap((res) => {
          this.accessToken = res.accessToken;

          return this.userService.readMe();
        }),
      );
  }

  initialize() {
    return this.refreshTokens().pipe(
      concatMap((res) => {
        this.accessToken = res.accessToken;

        return this.userService.readMe();
      }),
    );
  }

  closeSession() {
    this.accessToken = null;

    this.userService.clearMe();
  }
}
