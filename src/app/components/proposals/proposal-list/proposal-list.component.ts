import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { BehaviorSubject } from 'rxjs';
import { Proposal } from '../../../models/proposal.model';

@Component({
  selector: 'dipnoi-proposal-list',
  standalone: true,
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.scss',
  imports: [CommonModule, InfiniteScrollModule, ProposalCardComponent],
})
export class ProposalListComponent {
  @Input({ required: true }) infiniteScrollContainerRef!: HTMLElement;

  proposals = new BehaviorSubject<Proposal[]>([
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '1',
      description: 'YISUS',
    },
  ]);

  onScrollEnd() {
    this.proposals.next(
      this.proposals.value.concat(
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          title: '1',
          description: 'YISUS',
        },
      ),
    );
  }
}
