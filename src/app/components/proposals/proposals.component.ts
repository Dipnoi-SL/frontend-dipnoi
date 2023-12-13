import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';

@Component({
  selector: 'dipnoi-proposals',
  standalone: true,
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
  ],
})
export class ProposalsComponent {
  proposalsBlaPath = `/${RoutePathEnum.PROPOSALS}/${RoutePathEnum.BLA}`;
  proposalsBlaBlaPath = `/${RoutePathEnum.PROPOSALS}/${RoutePathEnum.BLABLA}`;

  constructor(public readonly router: Router) {}
}
