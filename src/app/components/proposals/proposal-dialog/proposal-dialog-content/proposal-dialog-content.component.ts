import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../../models/proposal.model';
import { ProposalService } from '../../../../services/proposal.service';
import { ActivatedRoute } from '@angular/router';
import { RoutePathEnum } from '../../../../app.routes';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'dipnoi-proposal-dialog-content',
  standalone: true,
  templateUrl: './proposal-dialog-content.component.html',
  styleUrl: './proposal-dialog-content.component.scss',
  imports: [CommonModule],
})
export class ProposalDialogContentComponent implements OnInit, OnDestroy {
  @Input() proposal?: Proposal;

  signedIn$!: Subscription;

  constructor(
    private proposalService: ProposalService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.signedIn$ = this.authService.signedIn.subscribe(() => {
      this.proposalService
        .readOne({
          id: this.route.snapshot.queryParams[RoutePathEnum.PROPOSAL],
        })
        .subscribe();
    });
  }

  ngOnDestroy() {
    this.signedIn$.unsubscribe();
  }
}
