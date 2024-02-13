import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Poll } from '../models/poll.model';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private _polls$ = new BehaviorSubject<Poll[] | null>(null);
  polls$ = this._polls$.asObservable();

  constructor(private http: HttpClient) {}

  readMany(params: { proposalId: number }) {
    return this.http
      .get<Poll[]>(`${environment.apiUrl}/polls`, { params })
      .pipe(
        map((res) => res.map((poll) => new Poll(poll))),
        tap({
          next: (res) => {
            this._polls$.next(res);
          },
        }),
      );
  }

  createOrUpdateOneInterestVote(params: {
    id: number;
    myInterestVote: boolean | null;
  }) {
    return this.http
      .put<Poll>(
        `${environment.apiUrl}/polls/${params.id}/interest-votes`,
        params,
      )
      .pipe(
        map((res) => new Poll(res)),
        tap({
          next: (res) => {
            if (this._polls$.value) {
              const pollIndex = this._polls$.value.findIndex(
                (poll) => poll.id === res.id,
              );

              if (pollIndex >= 0) {
                this._polls$.next([
                  ...this._polls$.value.slice(0, pollIndex),
                  res,
                  ...this._polls$.value.slice(pollIndex + 1),
                ]);
              }
            }
          },
        }),
      );
  }
}
