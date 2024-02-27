import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RoutePathEnum } from './app.routes';
import { ProposalDialogComponent } from './components/proposals/proposal-dialog/proposal-dialog.component';
import { AuthComponent } from './components/auth/auth.component';
import { ComponentType } from '@angular/cdk/portal';
import { AuthService } from './services/auth.service';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ProposalCreationComponent } from './components/proposals/proposal-creation/proposal-creation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    HttpClientModule,
    DialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  queryParams$!: Subscription;
  dialogInfo: Record<
    string,
    { component: ComponentType<any>; ref: DialogRef<Component> | null }
  > = {
    [RoutePathEnum.AUTH]: { component: AuthComponent, ref: null },
    [RoutePathEnum.PROPOSAL]: { component: ProposalDialogComponent, ref: null },
    [RoutePathEnum.CREATION]: {
      component: ProposalCreationComponent,
      ref: null,
    },
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialog: Dialog,
    public authService: AuthService,
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
        { autoFocus: false },
      );

      this.dialogInfo[queryParam].ref?.closed.subscribe(() => {
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
