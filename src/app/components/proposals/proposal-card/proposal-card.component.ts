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
  selector: 'dipnoi-proposal-card',
  standalone: true,
  templateUrl: './proposal-card.component.html',
  styleUrl: './proposal-card.component.scss',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCardComponent implements OnInit {
  @Input({ required: true }) proposal!: Proposal;

  positiveRatio!: number;
  totalValue!: number;
  isInBacklog!: boolean;
  importanceTag!: string;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.totalValue = this.proposal.positiveValue + this.proposal.negativeValue;
    this.positiveRatio = this.totalValue
      ? Math.round((100 * this.proposal.positiveValue) / this.totalValue)
      : 0;
    this.isInBacklog =
      this.proposal.state === ProposalStateEnum.SELECTED_FOR_DEVELOPMENT ||
      this.proposal.state === ProposalStateEnum.IN_DEVELOPMENT;
    this.importanceTag =
      this.proposal.importance > 4
        ? 'MAX'
        : this.proposal.importance > 3
          ? 'HIGH'
          : this.proposal.importance > 2
            ? 'MED'
            : this.proposal.importance > 1
              ? 'LOW'
              : 'MIN';
  }

  buildSelectedQueryParam() {
    return { [RoutePathEnum.PROPOSAL]: this.proposal.id };
  }
}
