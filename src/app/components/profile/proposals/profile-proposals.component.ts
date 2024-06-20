import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dipnoi-profile-proposals',
  standalone: true,
  templateUrl: './profile-proposals.component.html',
  styleUrl: './profile-proposals.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileProposalsComponent {}
