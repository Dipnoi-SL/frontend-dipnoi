import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-proposal-card',
  standalone: true,
  templateUrl: './proposal-card.component.html',
  styleUrl: './proposal-card.component.scss',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCardComponent {
  @Input({ required: true }) proposal!: Proposal;

  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
  ) {}
}
