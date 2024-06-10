import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dipnoi-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {}
