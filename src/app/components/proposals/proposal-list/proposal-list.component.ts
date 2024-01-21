import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { ProposalService } from '../../../services/proposal.service';
import { ProposalStateEnum } from '../../../constants/enums';

@Component({
  selector: 'dipnoi-proposal-list',
  standalone: true,
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.scss',
  imports: [CommonModule, InfiniteScrollModule, ProposalCardComponent],
})
export class ProposalListComponent implements OnInit {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;

  constructor(public proposalService: ProposalService) {}

  ngOnInit() {
    this.proposalService
      .reset({
        states: [
          ProposalStateEnum.SELECTED_FOR_DEVELOPMENT,
          ProposalStateEnum.IN_DEVELOPMENT,
        ],
      })
      .subscribe();
  }

  onScrollEnd() {
    this.proposalService
      .readMore({
        states: [
          ProposalStateEnum.SELECTED_FOR_DEVELOPMENT,
          ProposalStateEnum.IN_DEVELOPMENT,
        ],
      })
      ?.subscribe();
  }
}
