import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { RoutePathEnum } from '../../app.routes';

@Component({
  selector: 'dipnoi-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [CommonModule, MatToolbarModule, RouterLink],
})
export class FooterComponent {
  aboutUsPath = `/${RoutePathEnum.ABOUT_US}`;
}
