import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoutePathEnum } from './app.routes';
import { ProposalDialogComponent } from './components/proposals/proposal-dialog/proposal-dialog.component';
import { AuthComponent } from './components/auth/auth.component';
import { ComponentType } from '@angular/cdk/portal';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    MatTabsModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  queryParams$!: Subscription;
  dialogInfo: Record<
    string,
    { component: ComponentType<any>; ref: MatDialogRef<Component> | null }
  > = {
    [RoutePathEnum.AUTH]: { component: AuthComponent, ref: null },
    [RoutePathEnum.PROPOSAL]: { component: ProposalDialogComponent, ref: null },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.initialize().subscribe();

    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      let shouldCloseAll = true;

      for (const key of Object.keys(this.dialogInfo)) {
        if (queryParams[key]) {
          this.toggleDialog(key);

          shouldCloseAll = false;

          break;
        }
      }

      if (shouldCloseAll) {
        this.dialog.closeAll();
      }
    });
  }

  ngOnDestroy() {
    this.queryParams$.unsubscribe();
  }

  toggleDialog(queryParam: string) {
    if (!this.dialogInfo[queryParam].ref) {
      for (const key of Object.keys(this.dialogInfo)) {
        if (key !== queryParam) {
          this.dialogInfo[key].ref?.close();

          this.dialogInfo[key].ref = null;
        }
      }

      this.dialogInfo[queryParam].ref = this.dialog.open(
        this.dialogInfo[queryParam].component,
      );

      this.dialogInfo[queryParam].ref?.afterClosed().subscribe(() => {
        this.dialogInfo[queryParam].ref = null;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { [queryParam]: null },
          queryParamsHandling: 'merge',
        });
      });
    }
  }
}
