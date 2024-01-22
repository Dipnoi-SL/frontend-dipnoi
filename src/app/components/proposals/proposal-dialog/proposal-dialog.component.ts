import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../services/proposal.service';
import { ProposalDialogContentComponent } from './proposal-dialog-content/proposal-dialog-content.component';
import { Proposal } from '../../../models/proposal.model';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';

@Component({
  selector: 'dipnoi-proposal-dialog',
  standalone: true,
  templateUrl: './proposal-dialog.component.html',
  styleUrl: './proposal-dialog.component.scss',
  imports: [CommonModule, ProposalDialogContentComponent],
})
export class ProposalDialogComponent {
  proposalId!: number;
  initialProposal?: Proposal;

  constructor(
    public proposalService: ProposalService,
    private route: ActivatedRoute,
  ) {
    this.proposalId =
      parseInt(this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL]) ?? 0;

    this.initialProposal =
      this.proposalService.proposalsInfo.value[this.proposalId] ??
      this.proposalService.proposalsList.value.find(
        (proposal) => proposal.id === this.proposalId,
      );
  }
}
