import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
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
export class ParamsComponent
  extends StatefulComponent<{
    params: {
      search?: string;
      selectedFilter: number;
      selectedOrder: number;
    };
    isFilterDropdownOpen: boolean;
    isOrderDropdownOpen: boolean;
  }>
  implements OnInit
{
  @Input() filterOptions?: string[];
  @Input() orderOptions?: string[];
  @Input() defaultFilter?: number;
  @Input() defaultOrder?: number;

  @Output() onParamsUpdated = new EventEmitter<{
    search?: string;
    selectedFilter: number;
    selectedOrder: number;
  }>();

  debounceTimeout?: NodeJS.Timeout;
  search = '';

  constructor() {
    super({
      params: {
        selectedFilter: 0,
        selectedOrder: 0,
      },
      isFilterDropdownOpen: false,
      isOrderDropdownOpen: false,
    });
  }

  ngOnInit() {
    this.updateState({
      params: {
        ...this.state.params,
        selectedFilter: this.defaultFilter ?? 0,
        selectedOrder: this.defaultOrder ?? 0,
      },
    });
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(element: HTMLElement) {
    if (!element.closest('.dropdown-button-filter')) {
      this.updateState({
        isFilterDropdownOpen: false,
      });
    }
    if (!element.closest('.dropdown-button-order')) {
      this.updateState({
        isOrderDropdownOpen: false,
      });
    }
  }

  toggleOrderDropdown() {
    this.updateState({
      isOrderDropdownOpen: !this.state.isOrderDropdownOpen,
    });
  }

  toggleFilterDropdown() {
    this.updateState({
      isFilterDropdownOpen: !this.state.isFilterDropdownOpen,
    });
  }

  debounceSearch() {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      this.updateState({
        params: { ...this.state.params, search: this.search },
      });

      this.onParamsUpdated.emit(this.state.params);
    }, 500);
  }

  onFilterChange(index: number) {
    this.updateState({
      params: { ...this.state.params, selectedFilter: index },
    });

    this.onParamsUpdated.emit(this.state.params);
  }

  onOrderChange(index: number) {
    this.updateState({
      params: { ...this.state.params, selectedOrder: index },
    });

    this.onParamsUpdated.emit(this.state.params);
  }
}
