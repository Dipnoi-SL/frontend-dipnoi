import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'dipnoi-main',
  standalone: true,
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss',
  imports: [CommonModule, MatSidenavModule],
})
export class ProposalsComponent {}
