import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { PollService } from '../../../services/poll.service';
import { PollComponent } from '../poll/poll.component';

@Component({
  selector: 'dipnoi-proposal-dialog-content',
  standalone: true,
  templateUrl: './proposal-content.component.html',
  styleUrl: './proposal-content.component.scss',
  imports: [CommonModule, PollComponent],
})
export class ProposalContentComponent implements OnInit, OnDestroy {
  @Input({ required: true }) proposal!: Proposal;

  signedIn$!: Subscription;

  constructor(
    public pollService: PollService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.signedIn$ = this.authService.signedIn.subscribe(() => {
      this.pollService
        .readMany({
          proposalId: this.proposal.id,
        })
        .subscribe();
    });
  }

  ngOnDestroy() {
    this.signedIn$.unsubscribe();
  }
}
