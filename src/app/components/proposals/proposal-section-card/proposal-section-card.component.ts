import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'dipnoi-proposal-section-card',
  standalone: true,
  templateUrl: './proposal-section-card.component.html',
  styleUrl: './proposal-section-card.component.scss',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalSectionCardComponent {
  @Input({ required: true }) proposal!: Proposal;
  @Input({ required: true }) previousProposal?: Proposal;

  constructor(public route: ActivatedRoute) {}
}
