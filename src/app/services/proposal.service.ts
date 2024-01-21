import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import {
  OrderEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../constants/enums';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  proposals = new BehaviorSubject<Proposal[]>([]);
  pageMeta = new BehaviorSubject<{
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null>(null);

  constructor(private http: HttpClient) {}

  reset(params?: {
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
            this.proposals.next(res.data);
            this.pageMeta.next(res.meta);
          },
        }),
      );
  }

  readMore(params?: {
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
              this.proposals.next(this.proposals.value.concat(res.data));
              this.pageMeta.next(res.meta);
            },
          }),
        );
    }

    return;
  }
}
