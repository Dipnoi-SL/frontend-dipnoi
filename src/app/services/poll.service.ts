import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Poll } from '../models/poll.model';
import { BehaviorSubject, map, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private _polls$ = new BehaviorSubject<Poll[] | null>(null);
  polls$ = this._polls$.asObservable();

  private _initialPoll$ = new BehaviorSubject<Poll | null>(null);
  initialPoll$ = this._initialPoll$.asObservable();

  private _finalPoll$ = new BehaviorSubject<Poll | null>(null);
  finalPoll$ = this._finalPoll$.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  readMany(params: { proposalId: number }) {
    return this.http
      .get<Poll[]>(`${environment.apiUrl}/polls`, { params })
      .pipe(
        map((res) => res.map((poll) => new Poll(poll))),
        tap({
          next: (res) => {
            const polls: Poll[] = [];
            let finalFound = false;

            for (const poll of res) {
              if (poll.isInitial) {
                this._initialPoll$.next(poll);
              } else if (poll.isFinal) {
                finalFound = true;

                this._finalPoll$.next(poll);
              } else {
                polls.push(poll);
              }
            }

            if (!finalFound) {
              this._finalPoll$.next(null);
            }

            this._polls$.next(polls);
          },
        }),
      );
  }

  createOrUpdateOneInterestVote(params: {
    id: number;
    myInterestVote: boolean | null;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Poll>(
          `${environment.apiUrl}/polls/${params.id}/interest-votes`,
          params,
        )
        .pipe(
          map((res) => new Poll(res)),
          tap({
            next: (res) => {
              if (res.isInitial) {
                this._initialPoll$.next(res);
              } else if (res.isFinal) {
                this._finalPoll$.next(res);
              } else {
                this.updateLists(res);
              }
            },
          }),
        );
    }

    return;
  }

  updateLists(res: Poll) {
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
  }
}
