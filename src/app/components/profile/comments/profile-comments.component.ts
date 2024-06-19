import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dipnoi-profile-comments',
  standalone: true,
  templateUrl: './profile-comments.component.html',
  styleUrl: './profile-comments.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentsComponent {}
