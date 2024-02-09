import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';

@Component({
  selector: 'dipnoi-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, ProposalListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
