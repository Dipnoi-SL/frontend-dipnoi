import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { GameService } from '../services/game.service';
import { RoutePathEnum } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class GameActiveGuard implements CanActivate {
  constructor(
    private gameService: GameService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.gameService
      .readOne({
        id: parseInt(state.url.split('/')[2]),
      })
      .pipe(
        map((game) => {
          if (!game.active) {
            this.router.navigate([
              RoutePathEnum.GAMES,
              this.gameService.selectedGameId,
              RoutePathEnum.REQUESTS,
            ]);

            return false;
          }

          return true;
        }),
      );
  }
}
