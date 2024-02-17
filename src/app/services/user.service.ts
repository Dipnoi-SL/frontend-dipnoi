import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { MyUser } from '../models/my-user.model';
import { environment } from '../../environments/environment';
import { NicknameExistance } from '../models/nickname-existance.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _authUser$ = new BehaviorSubject<MyUser | null>(null);
  authUser$ = this._authUser$.asObservable();

  constructor(private http: HttpClient) {}

  readMe() {
    return this.http.get<MyUser>(`${environment.apiUrl}/users/me`).pipe(
      map((res) => new MyUser(res)),
      tap({
        next: (res) => {
          this._authUser$.next(res);
        },
      }),
    );
  }

  clearMe() {
    this._authUser$.next(null);
  }

  updateMe(params: { nickname: string }) {
    if (this._authUser$.value) {
      return this.http
        .put<MyUser>(`${environment.apiUrl}/users/me`, params)
        .pipe(
          map((res) => new MyUser(res)),
          tap({
            next: (res) => {
              this._authUser$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneAvatar(params: { avatar: File }) {
    if (this._authUser$.value) {
      const formData = new FormData();

      formData.append('file', params.avatar, params.avatar.name);

      return this.http
        .put<MyUser>(`${environment.apiUrl}/users/me/avatar`, formData)
        .pipe(
          map((res) => new MyUser(res)),
          tap({
            next: (res) => {
              this._authUser$.next(res);
            },
          }),
        );
    }

    return;
  }

  checkNicknameExistance(params: { nickname: string }) {
    return this.http.get<NicknameExistance>(
      `${environment.apiUrl}/users/nicknames/${params.nickname}`,
    );
  }
}
