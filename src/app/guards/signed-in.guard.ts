import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SignedInGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate() {
    return this.userService.authUser$.pipe(
      map((authUser) => {
        if (!authUser) {
          this.router.navigate(['/']);

          return false;
        }

        return true;
      }),
    );
  }
}
