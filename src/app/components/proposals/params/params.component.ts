import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { OrderEnum, ProposalOrderByEnum } from '../../../constants/enums';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-params',
  standalone: true,
  templateUrl: './params.component.html',
  styleUrl: './params.component.scss',
  imports: [CommonModule, FormsModule, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamsComponent extends StatefulComponent<{
  params: {
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  };
  isDropdownOpen: boolean;
}> {
  @Output() onParamsUpdated = new EventEmitter<{
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }>();

  debounceTimeout?: NodeJS.Timeout;
  search = '';

  constructor() {
    super({ params: {}, isDropdownOpen: false });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.dropdown-button')) {
      this.updateState({ isDropdownOpen: false });
    }
  }

  toggleDropdown() {
    this.updateState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  debounceSearch() {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      this.updateState({
        params: { ...this.state.params, search: this.search },
      });

      this.onParamsUpdated.emit(this.state.params);
    }, 700);
  }
}
