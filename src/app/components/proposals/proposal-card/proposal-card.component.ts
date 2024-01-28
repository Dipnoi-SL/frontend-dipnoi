import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-proposal-card',
  standalone: true,
  templateUrl: './proposal-card.component.html',
  styleUrl: './proposal-card.component.scss',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCardComponent {
  @Input({ required: true }) proposal!: Proposal;

  constructor(public route: ActivatedRoute) {}

  buildSelectedQueryParam() {
    return { [RoutePathEnum.PROPOSAL]: this.proposal.id };
  }
}
