import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { ProposalStateEnum } from '../../../constants/enums';

@Component({
  selector: 'dipnoi-proposal-section-card',
  standalone: true,
  templateUrl: './proposal-section-card.component.html',
  styleUrl: './proposal-section-card.component.scss',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalSectionCardComponent implements OnInit {
  @Input({ required: true }) proposal!: Proposal;
  @Input({ required: true }) previousProposal?: Proposal;

  isFirstInSection!: boolean;
  finalDate!: Date;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.finalDate =
      this.proposal.state === ProposalStateEnum.COMPLETED
        ? new Date(this.proposal.completedAt!)
        : new Date(this.proposal.disregardedAt!);
    if (!this.previousProposal) {
      this.isFirstInSection = true;
    } else {
      const previousFinalDate =
        this.previousProposal.state === ProposalStateEnum.COMPLETED
          ? new Date(this.previousProposal.completedAt!)
          : new Date(this.previousProposal.disregardedAt!);
      this.isFirstInSection =
        this.finalDate.getFullYear() !== previousFinalDate.getFullYear() ||
        this.finalDate.getMonth() !== previousFinalDate.getMonth();
    }
  }

  buildSelectedQueryParam() {
    return { [RoutePathEnum.PROPOSAL]: this.proposal.id };
  }
}
