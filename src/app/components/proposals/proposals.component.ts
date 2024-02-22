import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdsComponent } from './ads/ads.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';

@Component({
  selector: 'dipnoi-proposals',
  standalone: true,
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss',
  imports: [CommonModule, RouterOutlet, AdsComponent, SideNavigationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalsComponent {}
