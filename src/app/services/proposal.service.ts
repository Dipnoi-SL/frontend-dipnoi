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
import { BehaviorSubject, map, tap } from 'rxjs';
import { PageMeta } from '../models/page-meta.model';
import { UserService } from './user.service';

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

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

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
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params,
      })
      .pipe(
        map((res) => ({
          data: res.data.map((proposal) => new Proposal(proposal)),
          meta: new PageMeta(res.meta),
        })),
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
          map((res) => ({
            data: res.data.map((proposal) => new Proposal(proposal)),
            meta: new PageMeta(res.meta),
          })),
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
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params,
      })
      .pipe(
        map((res) => ({
          data: res.data.map((proposal) => new Proposal(proposal)),
          meta: new PageMeta(res.meta),
        })),
        tap({
          next: (res) => {
            this._pinnedProposals$.next(res.data);
          },
        }),
      );
  }

  readOne(params: { id: number }) {
    return this.http
      .get<Proposal>(`${environment.apiUrl}/proposals/${params.id}`)
      .pipe(
        map((res) => new Proposal(res)),
        tap({
          next: (res) => {
            this._selectedProposal$.next(res);
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
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(`${environment.apiUrl}/proposals`, params)
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._proposals$.next([res, ...this._proposals$.value!]);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneThumbnail(params: { id: number; thumbnail: File }) {
    if (this.userService.isActive) {
      const formData = new FormData();

      formData.append('file', params.thumbnail, params.thumbnail.name);

      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/thumbnail`,
          formData,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOneFollow(params: { id: number }) {
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/follows`,
          {},
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  deleteOneFollow(params: { id: number }) {
    if (this.userService.isActive) {
      return this.http
        .delete<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/follows`,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneSpecification(params: {
    id: number;
    finalTitle: string;
    finalDescription: string;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/specifications`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneReview(params: {
    id: number;
    state: ProposalStateEnum;
    cost?: number;
    disregardingReason?: string;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/reviews`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOneTransition(params: { id: number; state: ProposalStateEnum }) {
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/transitions`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneImportanceVote(params: {
    id: number;
    myImportanceVote: number | null;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${params.id}/importance-votes`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);
            },
          }),
        );
    }

    return;
  }
}
