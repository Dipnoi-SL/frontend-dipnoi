import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import {
  OrderEnum,
  ProposalCategoryEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../constants/enums';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  proposalsInfo = new BehaviorSubject<Record<number, Proposal | undefined>>({});
  proposalsList = new BehaviorSubject<Proposal[]>([]);
  pageMeta = new BehaviorSubject<{
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null>(null);

  constructor(private http: HttpClient) {}

  readMany(params: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params: { ...params, page: 1, take: 10 },
      })
      .pipe(
        tap({
          next: (res) => {
            this.proposalsList.next(res.data);

            this.pageMeta.next(res.meta);
          },
        }),
      );
  }

  readMore(params: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    if (this.pageMeta.value?.hasNextPage) {
      return this.http
        .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
          params: { ...params, page: this.pageMeta.value.page + 1, take: 10 },
        })
        .pipe(
          tap({
            next: (res) => {
              this.proposalsList.next(
                this.proposalsList.value.concat(res.data),
              );

              this.pageMeta.next(res.meta);
            },
          }),
        );
    }

    return;
  }

  createOne(params: {
    initialTitle: string;
    initialDescription: string;
    categories: ProposalCategoryEnum[];
    pollLabels: string[];
  }) {
    return this.http
      .post<Proposal>(`${environment.apiUrl}/proposals`, params)
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  readOne(params: { id: number }) {
    return this.http
      .get<Proposal>(`${environment.apiUrl}/proposals/${params.id}`)
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  createOneFollow(params: { id: number }) {
    return this.http
      .post<Proposal>(
        `${environment.apiUrl}/proposals/${params.id}/follows`,
        {},
      )
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  deleteOneFollow(params: { id: number }) {
    return this.http
      .delete<Proposal>(`${environment.apiUrl}/proposals/${params.id}/follows`)
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  createOrUpdateOneSpecification(params: {
    id: number;
    finalTitle: string;
    finalDescription: string;
  }) {
    return this.http
      .put<Proposal>(
        `${environment.apiUrl}/proposals/${params.id}/specifications`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  createOrUpdateOneReview(params: {
    id: number;
    state: ProposalStateEnum;
    cost?: number;
    disregardingReason?: string;
  }) {
    return this.http
      .put<Proposal>(
        `${environment.apiUrl}/proposals/${params.id}/reviews`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  createOneTransition(params: { id: number; state: ProposalStateEnum }) {
    return this.http
      .post<Proposal>(
        `${environment.apiUrl}/proposals/${params.id}/transitions`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }

  createOrUpdateOneImportanceVote(params: {
    id: number;
    myImportanceVote: number | null;
  }) {
    return this.http
      .put<Proposal>(
        `${environment.apiUrl}/proposals/${params.id}/importance-votes`,
        params,
      )
      .pipe(
        tap({
          next: (res) => {
            this.proposalsInfo.next({
              ...this.proposalsInfo.value,
              [res.id]: res,
            });
          },
        }),
      );
  }
}
