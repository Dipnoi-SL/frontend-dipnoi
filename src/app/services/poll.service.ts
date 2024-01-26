import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Poll } from '../models/poll.model';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  pollsInfo = new BehaviorSubject<Record<number, Poll[] | undefined>>({});

  constructor(private http: HttpClient) {}

  readMany(params: { proposalId: number }) {
    return this.http
      .get<Poll[]>(`${environment.apiUrl}/polls`, { params })
      .pipe(
        tap({
          next: (res) => {
            this.pollsInfo.next({
              ...this.pollsInfo.value,
              [params.proposalId]: res,
            });
          },
        }),
      );
  }

  createOrUpdateOneInterestVote(params: {
    proposalId: number;
    id: number;
    myInterestVote: boolean | null;
  }) {
    return this.http
      .put<Poll>(
        `${environment.apiUrl}/polls/${params.id}/interest-votes`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            const pollIndex = this.pollsInfo.value[
              params.proposalId
            ]?.findIndex((poll) => poll.id === params.id);

            if (pollIndex === undefined || pollIndex === -1) {
              this.pollsInfo.next({
                ...this.pollsInfo.value,
                [params.proposalId]: [res].concat(
                  this.pollsInfo.value[params.proposalId] ?? [],
                ),
              });
            } else {
              this.pollsInfo.next({
                ...this.pollsInfo.value,
                [params.proposalId]: this.pollsInfo.value[
                  params.proposalId
                ]!.splice(pollIndex, 1, res),
              });
            }
          },
        }),
      );
  }
}
