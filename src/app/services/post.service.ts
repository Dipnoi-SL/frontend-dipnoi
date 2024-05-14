import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';
import { PostOrderByEnum, OrderEnum } from '../constants/enums';
import { Page } from '../models/page.model';
import { BehaviorSubject, map, tap } from 'rxjs';
import { PageMeta } from '../models/page-meta.model';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts$ = new BehaviorSubject<Post[] | null>(null);
  posts$ = this._posts$.asObservable();

  meta: PageMeta | null = null;

  constructor(
    private http: HttpClient,
    private gameService: GameService,
  ) {}

  readMany(params: {
    take?: number;
    page?: number;
    orderBy?: PostOrderByEnum;
    order?: OrderEnum;
  }) {
    return this.http
      .get<Page<Post>>(`${environment.apiUrl}/posts`, {
        params: { ...params, gameId: this.gameService.selectedGameId! },
      })
      .pipe(
        map((res) => ({
          data: res.data.map((post) => new Post(post)),
          meta: new PageMeta(res.meta),
        })),
        tap({
          next: (res) => {
            this._posts$.next(res.data);

            this.meta = res.meta;
          },
        }),
      );
  }

  readManyMore(params: {
    take?: number;
    page?: number;
    orderBy?: PostOrderByEnum;
    order?: OrderEnum;
  }) {
    if (this.meta?.hasNextPage) {
      return this.http
        .get<Page<Post>>(`${environment.apiUrl}/posts`, {
          params: {
            ...params,
            gameId: this.gameService.selectedGameId!,
            page: this.meta.page + 1,
          },
        })
        .pipe(
          map((res) => ({
            data: res.data.map((post) => new Post(post)),
            meta: new PageMeta(res.meta),
          })),
          tap({
            next: (res) => {
              this._posts$.next(this._posts$.value!.concat(res.data));

              this.meta = res.meta;
            },
          }),
        );
    }

    return;
  }
}
