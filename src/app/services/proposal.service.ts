import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Proposal } from '../models/proposal.model';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  proposals = new BehaviorSubject<Proposal[]>([]);

  constructor(private readonly http: HttpClient) {}

  fetch() {
    const tmp: Proposal[] = [];
    for (let i = 0; i < 20; i += 1) {
      tmp.push({
        id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: `Title for proposal ${i}`,
        description: `Description for proposal ${i}...`,
      });
    }
    this.proposals.next(tmp);
  }

  fetchMore() {
    const tmp: Proposal[] = [];
    for (
      let i = this.proposals.value[this.proposals.value.length - 1].id;
      i < this.proposals.value[this.proposals.value.length - 1].id + 20;
      i += 1
    ) {
      tmp.push({
        id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: `Title for proposal ${i}`,
        description: `Description for proposal ${i}...`,
      });
    }
    this.proposals.next(this.proposals.value.concat(tmp));
  }
}
