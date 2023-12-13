import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from '../proposal-list/proposal-list.component';

@Component({
  selector: 'dipnoi-bla',
  standalone: true,
  templateUrl: './bla.component.html',
  styleUrl: './bla.component.scss',
  imports: [CommonModule, ProposalListComponent],
})
export class BlaComponent {}
