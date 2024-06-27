import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from '../../common/params/params.component';

@Component({
  selector: 'dipnoi-profile-comments',
  standalone: true,
  templateUrl: './profile-comments.component.html',
  styleUrl: './profile-comments.component.scss',
  imports: [CommonModule, ParamsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCommentsComponent {}
