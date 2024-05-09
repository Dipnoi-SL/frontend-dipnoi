import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from '../proposals/params/params.component';

@Component({
  selector: 'dipnoi-library',
  standalone: true,
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  imports: [CommonModule, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  filterOptionsData = [
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      text: 'Day',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      text: 'Week',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 30).toISOString(),
      text: 'Month',
    },
    {
      key: 'selectedAt',
      value: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 365).toISOString(),
      text: 'Year',
    },
    { key: 'selectedAt', text: 'All time' },
  ];
  filterOptions = this.filterOptionsData.map((option) => option.text);
  orderOptionsData = [
    {
      key: 'orderBy',
      value: 'ProposalOrderByEnum.SELECTED_AT',
      text: 'Recent',
    },
    {
      key: 'orderBy',
      value: 'ProposalOrderByEnum.IMPORTANCE',
      text: 'Top importance',
    },
    {
      key: 'orderBy',
      value: 'ProposalOrderByEnum.COST',
      text: 'Most cost',
    },
  ];
  orderOptions = this.orderOptionsData.map((option) => option.text);

  handleOnParamsUpdated(params: {
    search?: string;
    selectedFilter: number;
    selectedOrder: number;
  }) {
    console.log(params);
  }
}
