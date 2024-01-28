import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { MyUser } from '../models/my-user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _authUser$ = new BehaviorSubject<MyUser | null>(null);
  authUser$ = this._authUser$.asObservable();

  constructor(private http: HttpClient) {}

  readMe() {
    return this.http.get<MyUser>(`${environment.apiUrl}/users/me`).pipe(
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
}
