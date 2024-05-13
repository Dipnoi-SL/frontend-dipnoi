import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Proposal } from '../../../../models/proposal.model';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'dipnoi-spotlight-proposal',
  standalone: true,
  templateUrl: './spotlight-proposal.component.html',
  styleUrl: './spotlight-proposal.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpotlightProposalComponent {
  @Input({ required: true }) proposal!: Proposal;

  constructor(public route: ActivatedRoute) {}
}
