import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dipnoi-profile-games',
  standalone: true,
  templateUrl: './profile-games.component.html',
  styleUrl: './profile-games.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGamesComponent {}
