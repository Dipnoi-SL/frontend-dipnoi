import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService } from '../../../services/poll.service';
import { Poll } from '../../../models/poll.model';

@Component({
  selector: 'dipnoi-poll',
  standalone: true,
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
  imports: [CommonModule],
})
export class PollComponent {
  @Input({ required: true }) poll!: Poll;

  constructor(public pollService: PollService) {}
}
