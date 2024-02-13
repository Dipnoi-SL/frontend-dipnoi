import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Comment } from '../models/comment.model';
import { CommentOrderByEnum, OrderEnum } from '../constants/enums';
import { Page } from '../models/page.model';
import { BehaviorSubject, tap } from 'rxjs';
import { PageMeta } from '../models/page-meta.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private _comments$ = new BehaviorSubject<Comment[] | null>(null);
  comments$ = this._comments$.asObservable();

  meta: PageMeta | null = null;

  constructor(private http: HttpClient) {}

  readMany(params: {
    proposalId?: number;
    take?: number;
    page?: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  }) {
    this._comments$.next(null);

    this.meta = null;

    return this.http
      .get<Page<Comment>>(`${environment.apiUrl}/comments`, {
        params,
      })
      .pipe(
        tap({
          next: (res) => {
            this._comments$.next(res.data);

            this.meta = res.meta;
          },
        }),
      );
  }

  readManyMore(params: {
    proposalId?: number;
    take?: number;
    page?: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Comment>>(`${environment.apiUrl}/comments`, {
          params: { ...params, page: this.meta.page + 1 },
        })
        .pipe(
          tap({
            next: (res) => {
              this._comments$.next(this._comments$.value!.concat(res.data));

              this.meta = res.meta;
            },
          }),
        );
    }

    return;
  }

  createOne(params: { proposalId: number; body: string }) {
    return this.http
      .post<Comment>(`${environment.apiUrl}/comments`, params)
      .pipe(
        tap({
          next: (res) => {
            if (this._comments$.value) {
              this._comments$.next([res, ...this._comments$.value]);
            } else {
              this._comments$.next([res]);
            }
          },
        }),
      );
  }

  createOrUpdateOneFeedback(params: {
    id: number;
    myFeedback: boolean | null;
  }) {
    return this.http
      .put<Comment>(
        `${environment.apiUrl}/comments/${params.id}/feedbacks`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            if (this._comments$.value) {
              const commentIndex = this._comments$.value.findIndex(
                (comment) => comment.id === res.id,
              );

              if (commentIndex >= 0) {
                this._comments$.next([
                  ...this._comments$.value.slice(0, commentIndex),
                  res,
                  ...this._comments$.value.slice(commentIndex + 1),
                ]);
              }
            }
          },
        }),
      );
  }
}
