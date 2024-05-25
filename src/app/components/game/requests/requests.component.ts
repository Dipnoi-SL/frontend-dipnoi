import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { UserService } from '../../../services/user.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'dipnoi-requests',
  standalone: true,
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
  imports: [CommonModule, NgxSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent
  extends StatefulComponent<{
    finished: boolean;
    isRequestLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  selectedGame$!: Subscription;
  spinners$!: Subscription;

  constructor(
    public userService: UserService,
    public gameService: GameService,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ finished: false, isRequestLoading: false });
  }

  ngOnInit() {
    this.selectedGame$ = this.gameService.selectedGame$.subscribe(() => {
      this.updateState({ finished: false });
    });

    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isRequestLoading) {
        this.spinnerService.show('request');
      } else {
        this.spinnerService.hide('request');
      }
    });
  }

  onSendRequest() {
    this.updateState({ isRequestLoading: true });

    this.gameService
      .createOrUpdateOneRequest()
      ?.pipe(
        finalize(() => {
          this.updateState({ isRequestLoading: false });
        }),
      )
      .subscribe({
        next: () => {
          this.updateState({ finished: true });
        },
      });
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.selectedGame$.unsubscribe();

    super.ngOnDestroy();
  }
}
