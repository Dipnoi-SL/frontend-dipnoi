import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, tap } from 'rxjs';
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

  signUp(params: { email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/sign-up`, params);
  }

  signIn(params: { email: string; password: string }) {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/sign-in`, params, {
        withCredentials: true,
      })
      .pipe(
        map((res) => new TokenResponse(res)),
        concatMap((res) => {
          this.startSession(res);

          return this.userService.readMe();
        }),
      );
  }

  googleSignIn(params: { accessToken: string }) {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/google-sign-in`,
        params,
        { withCredentials: true },
      )
      .pipe(
        map((res) => new TokenResponse(res)),
        concatMap((res) => {
          this.startSession(res);

          return this.userService.readMe();
        }),
      );
  }

  facebookSignIn(params: { accessToken: string }) {
    return this.http
      .post<TokenResponse>(
        `${environment.apiUrl}/auth/facebook-sign-in`,
        params,
        { withCredentials: true },
      )
      .pipe(
        map((res) => new TokenResponse(res)),
        concatMap((res) => {
          this.startSession(res);

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
        map((res) => new TokenResponse(res)),
        tap({
          next: (res) => {
            this.startSession(res);
          },
        }),
      );
  }

  updatePassword(params: { newPassword: string; oldPassword: string }) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/update-password`,
        params,
        { withCredentials: true },
      )
      .pipe(
        map((res) => new TokenResponse(res)),
        tap({
          next: (res) => {
            this.startSession(res);
          },
        }),
      );
  }

  requestPasswordReset(params: { email: string }) {
    return this.http.post(
      `${environment.apiUrl}/auth/request-password-reset`,
      params,
    );
  }

  resetPassword(params: { newPassword: string; resetToken: string }) {
    return this.http
      .put<TokenResponse>(`${environment.apiUrl}/auth/reset-password`, params, {
        withCredentials: true,
      })
      .pipe(
        map((res) => new TokenResponse(res)),
        tap({
          next: (res) => {
            this.startSession(res);
          },
        }),
      );
  }

  requestActivation() {
    return this.http.post(`${environment.apiUrl}/auth/request-activation`, {});
  }

  activate(params: { activationToken: string; nickname: string }) {
    return this.http
      .put<TokenResponse>(`${environment.apiUrl}/auth/activate`, params, {
        withCredentials: true,
      })
      .pipe(
        map((res) => new TokenResponse(res)),
        concatMap((res) => {
          this.startSession(res);

          return this.userService.readMe();
        }),
      );
  }

  socialActivate(params: { nickname: string }) {
    return this.http
      .put<TokenResponse>(
        `${environment.apiUrl}/auth/social-activate`,
        params,
        { withCredentials: true },
      )
      .pipe(
        map((res) => new TokenResponse(res)),
        concatMap((res) => {
          this.startSession(res);

          return this.userService.readMe();
        }),
      );
  }

  initialize() {
    return this.refreshTokens().pipe(
      concatMap((res) => {
        this.startSession(res);

        return this.userService.readMe();
      }),
    );
  }

  startSession(res: TokenResponse) {
    this.accessToken = res.accessToken;
  }

  closeSession() {
    this.accessToken = null;

    this.userService.clearMe();
  }
}
