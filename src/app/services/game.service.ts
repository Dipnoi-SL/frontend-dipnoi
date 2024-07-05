import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrderEnum, GameOrderByEnum } from '../constants/enums';
import { Page } from '../models/page.model';
import { BehaviorSubject, map, tap } from 'rxjs';
import { PageMeta } from '../models/page-meta.model';
import { Game } from '../models/game.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _games$ = new BehaviorSubject<Game[] | null>(null);
  games$ = this._games$.asObservable();

  private _dropdownGames$ = new BehaviorSubject<Game[] | null>(null);
  dropdownGames$ = this._dropdownGames$.asObservable();

  private _navigationGames$ = new BehaviorSubject<Game[] | null>(null);
  navigationGames$ = this._navigationGames$.asObservable();

  private _selectedGame$ = new BehaviorSubject<Game | null>(null);
  selectedGame$ = this._selectedGame$.asObservable();

  meta: PageMeta | null = null;
  dropdownMeta: PageMeta | null = null;
  selectedGameId?: number;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  readMany(params: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
    played?: boolean;
    wishlisted?: boolean;
    favorites?: boolean;
  }) {
    return this.http
      .get<Page<Game>>(
        `${environment.apiUrl}/games${params.played ? '/played' : params.wishlisted ? '/wishlists' : params.favorites ? '/favorites' : ''}`,
        {
          params,
        },
      )
      .pipe(
        map((res) => ({
          data: res.data.map((game) => new Game(game)),
          meta: new PageMeta(res.meta),
        })),
        tap({
          next: (res) => {
            this._games$.next(res.data);

            this.meta = res.meta;
          },
        }),
      );
  }

  readManyMore(params: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
    played?: boolean;
    wishlisted?: boolean;
    favorites?: boolean;
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Game>>(
          `${environment.apiUrl}/games${params.played ? '/played' : params.wishlisted ? '/wishlists' : params.favorites ? '/favorites' : ''}`,
          {
            params: { ...params, page: this.meta.page + 1 },
          },
        )
        .pipe(
          map((res) => ({
            data: res.data.map((game) => new Game(game)),
            meta: new PageMeta(res.meta),
          })),
          tap({
            next: (res) => {
              this._games$.next(this._games$.value!.concat(res.data));

              this.meta = res.meta;
            },
          }),
        );
    }

    return;
  }

  readOne(params: { id: number }) {
    this.selectedGameId = params.id;

    return this.http
      .get<Game>(`${environment.apiUrl}/games/${this.selectedGameId}`)
      .pipe(
        map((res) => new Game(res)),
        tap({
          next: (res) => {
            this._selectedGame$.next(res);
          },
        }),
      );
  }

  createOrUpdateOneRequest() {
    if (this.userService.isActive) {
      return this.http
        .put<Game>(
          `${environment.apiUrl}/games/${this.selectedGameId}/requests`,
          {},
        )
        .pipe(
          map((res) => new Game(res)),
          tap({
            next: (res) => {
              this._selectedGame$.next(res);
            },
          }),
        );
    }

    return;
  }

  readManyAsDropdown(params: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
  }) {
    return this.http
      .get<Page<Game>>(`${environment.apiUrl}/games`, {
        params,
      })
      .pipe(
        map((res) => ({
          data: res.data.map((game) => new Game(game)),
          meta: new PageMeta(res.meta),
        })),
        tap({
          next: (res) => {
            this._dropdownGames$.next(res.data);

            this.dropdownMeta = res.meta;
          },
        }),
      );
  }

  readManyMoreAsDropdown(params: {
    take?: number;
    page?: number;
    orderBy?: GameOrderByEnum;
    order?: OrderEnum;
    search?: string;
  }) {
    if (this.dropdownMeta?.hasNextPage) {
      return this.http
        .get<Page<Game>>(`${environment.apiUrl}/games`, {
          params: { ...params, page: this.dropdownMeta.page + 1 },
        })
        .pipe(
          map((res) => ({
            data: res.data.map((game) => new Game(game)),
            meta: new PageMeta(res.meta),
          })),
          tap({
            next: (res) => {
              this._dropdownGames$.next(
                this._dropdownGames$.value!.concat(res.data),
              );

              this.dropdownMeta = res.meta;
            },
          }),
        );
    }

    return;
  }

  readManyAsNavigation() {
    if (this.userService.isActive) {
      return this.http
        .get<Game[]>(`${environment.apiUrl}/games/navigations`)
        .pipe(
          map((res) => res.map((game) => new Game(game))),
          tap({
            next: (res) => {
              this._navigationGames$.next(res);
            },
          }),
        );
    }

    return;
  }

  createOneNavigation(params: { id: number }) {
    if (this.userService.isActive) {
      return this.http
        .post<Game>(`${environment.apiUrl}/games/${params.id}/navigations`, {})
        .pipe(
          map((res) => new Game(res)),
          tap({
            next: (res) => {
              if (!this._navigationGames$.value) {
                this._navigationGames$.next([res]);
              } else {
                this._navigationGames$.next(
                  this._navigationGames$.value
                    .concat([res])
                    .sort((a, b) => a.name.localeCompare(b.name)),
                );
              }
            },
          }),
        );
    }

    return;
  }

  deleteOneNavigation(params: { id: number }) {
    if (this.userService.isActive) {
      return this.http
        .delete<Game>(
          `${environment.apiUrl}/games/${params.id}/navigations`,
          {},
        )
        .pipe(
          map((res) => new Game(res)),
          tap({
            next: (res) => {
              if (this._navigationGames$.value) {
                const gameIndex = this._navigationGames$.value.findIndex(
                  (game) => game.id === res.id,
                );

                if (gameIndex >= 0) {
                  this._navigationGames$.next([
                    ...this._navigationGames$.value.slice(0, gameIndex),
                    ...this._navigationGames$.value.slice(gameIndex + 1),
                  ]);
                }
              }
            },
          }),
        );
    }

    return;
  }
}
