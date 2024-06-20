import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'dipnoi-profile-overview',
  standalone: true,
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileOverviewComponent {
  constructor(public userService: UserService) {}
}
