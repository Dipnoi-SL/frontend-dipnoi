import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'dipnoi-bla',
  standalone: true,
  templateUrl: './bla.component.html',
  styleUrl: './bla.component.scss',
  imports: [CommonModule, InfiniteScrollModule, MatCardModule],
})
export class BlaComponent {
  proposals = [
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
  ];

  onScrolled() {
    console.log('A');
  }
}
