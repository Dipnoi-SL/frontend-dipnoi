import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import {
  OrderEnum,
  ProposalCategoryEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../constants/enums';
import { BehaviorSubject, tap } from 'rxjs';
import { PageMeta } from '../models/page-meta.model';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  private _proposals$ = new BehaviorSubject<Proposal[] | null>(null);
  proposals$ = this._proposals$.asObservable();

  private _pinnedProposals$ = new BehaviorSubject<Proposal[] | null>(null);
  pinnedProposals$ = this._pinnedProposals$.asObservable();

  private _selectedProposal$ = new BehaviorSubject<Proposal | null>(null);
  selectedProposal$ = this._selectedProposal$.asObservable();

  meta: PageMeta | null = null;

  constructor(private http: HttpClient) {}

  readMany(params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    this._proposals$.next(null);

    this.meta = null;

    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params,
      })
      .pipe(
        tap({
          next: (res) => {
            this._proposals$.next(res.data);

            this.meta = res.meta;
          },
        }),
      );
  }

  readManyMore(params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
          params: { ...params, page: this.meta.page + 1 },
        })
        .pipe(
          tap({
            next: (res) => {
              this._proposals$.next(this._proposals$.value!.concat(res.data));

              this.meta = res.meta;
            },
          }),
        );
    }

    return;
  }

  readManyAsPinned(params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    this._pinnedProposals$.next(null);

    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params,
      })
      .pipe(
        tap({
          next: (res) => {
            this._pinnedProposals$.next(res.data);
          },
        }),
      );
  }

  createOne(params: {
    initialTitle: string;
    initialDescription: string;
    categories: ProposalCategoryEnum[];
    pollLabels: string[];
  }) {
    return this.http.post<Proposal>(`${environment.apiUrl}/proposals`, params);
  }

  readOne(params: { id: number }) {
    this._selectedProposal$.next(null);

    return this.http
      .get<Proposal>(`${environment.apiUrl}/proposals/${params.id}`)
      .pipe(
        tap({
          next: (res) => {
            this._selectedProposal$.next(res);
          },
        }),
      );
  }

  createOrUpdateOneThumbnail(params: { id: number; thumbnail: File }) {
    const formData = new FormData();

    formData.append('file', params.thumbnail, params.thumbnail.name);

    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/thumbnail`,
      formData,
    );
  }

  createOneFollow(params: { id: number }) {
    return this.http.post<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/follows`,
      {},
    );
  }

  deleteOneFollow(params: { id: number }) {
    return this.http.delete<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/follows`,
    );
  }

  createOrUpdateOneSpecification(params: {
    id: number;
    finalTitle: string;
    finalDescription: string;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/specifications`,
      params,
    );
  }

  createOrUpdateOneReview(params: {
    id: number;
    state: ProposalStateEnum;
    cost?: number;
    disregardingReason?: string;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/reviews`,
      params,
    );
  }

  createOneTransition(params: { id: number; state: ProposalStateEnum }) {
    return this.http.post<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/transitions`,
      params,
    );
  }

  createOrUpdateOneImportanceVote(params: {
    id: number;
    myImportanceVote: number | null;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/importance-votes`,
      params,
    );
  }
}
