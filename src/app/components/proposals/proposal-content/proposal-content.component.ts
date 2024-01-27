import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proposal } from '../../../models/proposal.model';
import { PollService } from '../../../services/poll.service';
import { PollComponent } from '../poll/poll.component';

@Component({
  selector: 'dipnoi-proposal-dialog-content',
  standalone: true,
  templateUrl: './proposal-content.component.html',
  styleUrl: './proposal-content.component.scss',
  imports: [CommonModule, PollComponent],
})
export class ProposalContentComponent {
  @Input({ required: true }) proposal!: Proposal;

  constructor(public pollService: PollService) {}
}
