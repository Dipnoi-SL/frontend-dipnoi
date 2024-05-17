import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-requests',
  standalone: true,
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent extends StatefulComponent<{
  finished: boolean;
}> {
  constructor(
    public userService: UserService,
    public gameService: GameService,
  ) {
    super({ finished: false });
  }

  onSendRequest() {
    this.gameService.createOrUpdateOneRequest()?.subscribe({
      next: () => {
        this.updateState({ finished: true });
      },
    });
  }
}
