import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { MyUser } from '../models/my-user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authUser = new BehaviorSubject<MyUser | null>(null);

  constructor(private http: HttpClient) {}

  readMe() {
    return this.http.get<MyUser>(`${environment.apiUrl}/users/me`).pipe(
      tap({
        next: (res) => {
          this.authUser.next(res);
        },
      }),
    );
  }

  clearMe() {
    this.authUser.next(null);
  }
}
