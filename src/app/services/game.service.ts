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

  private _selectedGame$ = new BehaviorSubject<Game | null>(null);
  selectedGame$ = this._selectedGame$.asObservable();

  meta: PageMeta | null = null;
  preselectedGameId?: number;

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
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Game>>(`${environment.apiUrl}/games`, {
          params: { ...params, page: this.meta.page + 1 },
        })
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
    if (!this._selectedGame$.value) {
      this.preselectedGameId = params.id;
    }

    return this.http.get<Game>(`${environment.apiUrl}/games/${params.id}`).pipe(
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
          `${environment.apiUrl}/games/${this._selectedGame$.value?.id}/requests`,
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

  getSelectedGameId() {
    return this._selectedGame$.value?.id ?? this.preselectedGameId;
  }
}
