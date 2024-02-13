import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-proposal-stats',
  standalone: true,
  templateUrl: './proposal-stats.component.html',
  styleUrl: './proposal-stats.component.scss',
  imports: [CommonModule, NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalStatsComponent {
  constructor(public proposalService: ProposalService) {}
}
