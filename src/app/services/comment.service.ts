import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../models/comment.model';
import { CommentOrderByEnum, OrderEnum } from '../constants/enums';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  commentsInfo = new BehaviorSubject<Record<number, Comment[] | undefined>>({});
  pageMeta = new BehaviorSubject<{
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null>(null);

  constructor(private http: HttpClient) {}

  reset(params: {
    proposalId: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  }) {
    return this.http
      .get<Page<Comment>>(`${environment.apiUrl}/comments`, {
        params: { ...params, page: 1, take: 10 },
      })
      .pipe(
        tap({
          next: (res) => {
            this.commentsInfo.next({
              ...this.commentsInfo.value,
              [params.proposalId]: res.data,
            });

            this.pageMeta.next(res.meta);
          },
        }),
      );
  }

  readMore(params: {
    proposalId: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  }) {
    if (this.pageMeta.value?.hasNextPage) {
      return this.http
        .get<Page<Comment>>(`${environment.apiUrl}/comments`, {
          params: { ...params, page: this.pageMeta.value.page + 1, take: 10 },
        })
        .pipe(
          tap({
            next: (res) => {
              this.commentsInfo.next({
                ...this.commentsInfo.value,
                [params.proposalId]: (
                  this.commentsInfo.value[params.proposalId] ?? []
                ).concat(res.data),
              });

              this.pageMeta.next(res.meta);
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
            this.commentsInfo.next({
              ...this.commentsInfo.value,
              [params.proposalId]: [res].concat(
                this.commentsInfo.value[params.proposalId] ?? [],
              ),
            });
          },
        }),
      );
  }

  createOrUpdateOneFeedback(params: {
    proposalId: number;
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
            const commentIndex = this.commentsInfo.value[
              params.proposalId
            ]?.findIndex((comment) => comment.id === params.id);

            if (commentIndex === undefined || commentIndex === -1) {
              this.commentsInfo.next({
                ...this.commentsInfo.value,
                [params.proposalId]: [res].concat(
                  this.commentsInfo.value[params.proposalId] ?? [],
                ),
              });
            } else {
              this.commentsInfo.next({
                ...this.commentsInfo.value,
                [params.proposalId]: this.commentsInfo.value[
                  params.proposalId
                ]!.splice(commentIndex, 1, res),
              });
            }
          },
        }),
      );
  }
}
