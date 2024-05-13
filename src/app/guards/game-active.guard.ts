import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { BehaviorSubject } from 'rxjs';
import { RoutePathEnum } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class GameActiveGuard implements CanActivate {
  private _isGameActive$ = new BehaviorSubject<boolean>(true);
  isGameActive$ = this._isGameActive$.asObservable();

  constructor(
    private router: Router,
    private gameService: GameService,
  ) {
    this.gameService.selectedGame$.subscribe((game) => {
      if (!game || game.active) {
        return this._isGameActive$.next(true);
      }

      this.router.navigate([
        RoutePathEnum.GAMES,
        this.gameService.getSelectedGameId(),
        RoutePathEnum.REQUESTS,
      ]);

      this._isGameActive$.next(!!game?.active);
    });
  }

  canActivate() {
    return this.isGameActive$;
  }
}
