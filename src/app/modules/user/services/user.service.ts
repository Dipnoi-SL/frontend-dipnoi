import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser = new BehaviorSubject<User | null>(null);

  constructor(private readonly http: HttpClient) {}

  signIn(email: string | null, password: string | null) {
    console.log(email, password);
    return this.http.get<User>('/assets/current-user.json').pipe(
      tap((user) => {
        this.currentUser.next(user);
      }),
    );
  }

  signOut() {
    return this.http.get<User>('/assets/current-user.json').pipe(
      tap(() => {
        this.currentUser.next(null);
      }),
    );
  }
}
