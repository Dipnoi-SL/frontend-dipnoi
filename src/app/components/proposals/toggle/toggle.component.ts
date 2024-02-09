import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  imports: [CommonModule, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent extends StatefulComponent<{
  isToggled: boolean;
}> {
  @Output() onToggleUpdated = new EventEmitter<boolean>();

  constructor() {
    super({ isToggled: true });
  }

  onToggle() {
    this.updateState({ isToggled: !this.state.isToggled });

    this.onToggleUpdated.emit(this.state.isToggled);
  }
}
