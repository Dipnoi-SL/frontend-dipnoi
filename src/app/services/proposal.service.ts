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
import { GameService } from './game.service';

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

  private _spotlightProposal$ = new BehaviorSubject<Proposal | null>(null);
  spotlightProposal$ = this._spotlightProposal$.asObservable();

  meta: PageMeta | null = null;
  selectedProposalId?: number;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private gameService: GameService,
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
    selectedAt?: string;
    disregardedAt?: string;
    completedAt?: string;
    userId?: number;
  }) {
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params: { ...params, gameId: this.gameService.selectedGameId! },
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
    selectedAt?: string;
    disregardedAt?: string;
    completedAt?: string;
    userId?: number;
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
          params: {
            ...params,
            gameId: this.gameService.selectedGameId!,
            page: this.meta.page + 1,
          },
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
    selectedAt?: string;
    disregardedAt?: string;
    completedAt?: string;
    userId?: number;
  }) {
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params: { ...params, gameId: this.gameService.selectedGameId! },
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

  readOneAsSpotlight() {
    return this.http
      .get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
        params: {
          order: OrderEnum.DESC,
          orderBy: ProposalOrderByEnum.LAST_DAY_POPULARITY,
          take: 1,
          page: 1,
          states: [ProposalStateEnum.FINAL_PHASE, ProposalStateEnum.LAST_CALL],
          gameId: this.gameService.selectedGameId!,
        },
      })
      .pipe(
        map((res) => ({
          data: res.data.map((proposal) => new Proposal(proposal)),
          meta: new PageMeta(res.meta),
        })),
        tap({
          next: (res) => {
            this._spotlightProposal$.next(res.data[0] ?? null);
          },
        }),
      );
  }

  readOne(params: { id: number }) {
    this.selectedProposalId = params.id;

    return this.http
      .get<Proposal>(
        `${environment.apiUrl}/proposals/${this.selectedProposalId}`,
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

  createOne(params: {
    initialTitle: string;
    initialDescription: string;
    categories: ProposalCategoryEnum[];
    pollLabels: string[];
  }) {
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(`${environment.apiUrl}/proposals`, {
          ...params,
          gameId: this.gameService.selectedGameId,
        })
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

  createOrUpdateOneThumbnail(params: { thumbnail: File }) {
    if (this.userService.isActive) {
      const formData = new FormData();

      formData.append('file', params.thumbnail, params.thumbnail.name);

      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/thumbnail`,
          formData,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOneFollow() {
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/follows`,
          {},
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  deleteOneFollow() {
    if (this.userService.isActive) {
      return this.http
        .delete<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/follows`,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneSpecification(params: {
    finalTitle: string;
    finalDescription: string;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/specifications`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneApproval(params: { cost: number }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/approvals`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneRejection(params: {
    state: ProposalStateEnum;
    disregardingReason: string;
  }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/rejections`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOneTransition(params: { state: ProposalStateEnum }) {
    if (this.userService.isActive) {
      return this.http
        .post<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/transitions`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  createOrUpdateOneImportanceVote(params: { myImportanceVote: number | null }) {
    if (this.userService.isActive) {
      return this.http
        .put<Proposal>(
          `${environment.apiUrl}/proposals/${this._selectedProposal$.value?.id}/importance-votes`,
          params,
        )
        .pipe(
          map((res) => new Proposal(res)),
          tap({
            next: (res) => {
              this._selectedProposal$.next(res);

              this.updateLists(res);
            },
          }),
        );
    }

    return;
  }

  updateLists(res: Proposal) {
    if (this._proposals$.value) {
      const proposalIndex = this._proposals$.value.findIndex(
        (proposal) => proposal.id === res.id,
      );

      if (proposalIndex >= 0) {
        if (
          (res.isPendingSpecification &&
            this._proposals$.value.every(
              (proposal) => proposal.isPendingReview,
            )) ||
          (res.isFinalPhase &&
            this._proposals$.value[proposalIndex].isPendingReview) ||
          (res.isSelectedForDevelopment &&
            this._proposals$.value[proposalIndex].isLastCall) ||
          (res.isCompleted &&
            !this._proposals$.value[proposalIndex].isCompleted) ||
          (res.isNotViable &&
            !this._proposals$.value[proposalIndex].isNotViable) ||
          (res.isNotBacked &&
            !this._proposals$.value[proposalIndex].isNotBacked)
        ) {
          this._proposals$.next([
            ...this._proposals$.value.slice(0, proposalIndex),
            ...this._proposals$.value.slice(proposalIndex + 1),
          ]);
        } else {
          this._proposals$.next([
            ...this._proposals$.value.slice(0, proposalIndex),
            res,
            ...this._proposals$.value.slice(proposalIndex + 1),
          ]);
        }
      }
    }

    if (this._pinnedProposals$.value) {
      const proposalIndex = this._pinnedProposals$.value.findIndex(
        (proposal) => proposal.id === res.id,
      );

      if (proposalIndex >= 0) {
        if (
          res.isPendingReview &&
          this._pinnedProposals$.value[proposalIndex].isPendingSpecification
        ) {
          this._pinnedProposals$.next([
            ...this._pinnedProposals$.value.slice(0, proposalIndex),
            ...this._pinnedProposals$.value.slice(proposalIndex + 1),
          ]);
        } else {
          this._pinnedProposals$.next([
            ...this._pinnedProposals$.value.slice(0, proposalIndex),
            res,
            ...this._pinnedProposals$.value.slice(proposalIndex + 1),
          ]);
        }
      }
    }
  }
}
