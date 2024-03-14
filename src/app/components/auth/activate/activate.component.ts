import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { RoutePathEnum } from '../../../app.routes';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { Subscription, finalize, map, switchMap, timer } from 'rxjs';
import {
  NICKNAME_VALIDATION_MAX_LENGTH,
  NICKNAME_VALIDATION_MIN_LENGTH,
  NICKNAME_VALIDATION_REGEXP,
} from '../../../constants/literals';
import { UserService } from '../../../services/user.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'dipnoi-activate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIconComponent],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateComponent
  extends StatefulComponent<{
    typing: boolean;
    finished: boolean;
    activationToken: string;
  }>
  implements OnInit, OnDestroy
{
  queryParams$!: Subscription;
  statusChanges$!: Subscription;
  typing$!: Subscription;
  typingTimeout!: NodeJS.Timeout;
  signUpQueryParam = { [RoutePathEnum.AUTH]: RoutePathEnum.SIGN_UP };
  activateForm = this.formBuilder.group({
    nickname: [
      '',
      [
        Validators.required,
        Validators.minLength(NICKNAME_VALIDATION_MIN_LENGTH),
        Validators.maxLength(NICKNAME_VALIDATION_MAX_LENGTH),
        Validators.pattern(NICKNAME_VALIDATION_REGEXP),
      ],
      this.validateNickname.bind(this),
    ],
  });

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public formBuilder: NonNullableFormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    super({ typing: false, finished: false, activationToken: '' });
  }

  ngOnInit() {
    this.queryParams$ = this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['activationToken']) {
        this.updateState({ activationToken: queryParams['activationToken'] });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ['activationToken']: null },
          queryParamsHandling: 'merge',
        });
      }
    });

    this.typing$ = this.activateForm.valueChanges.subscribe(() => {
      this.updateState({ typing: true });

      clearTimeout(this.typingTimeout);

      this.typingTimeout = setTimeout(() => {
        this.updateState({ typing: false });
      }, 500);
    });
  }

  onFinish() {
    if (this.state.activationToken) {
      this.authService
        .activate({
          nickname: this.activateForm.controls.nickname.value as string,
          activationToken: this.state.activationToken,
        })
        .subscribe({
          next: () => {
            this.updateState({ finished: true });
          },
        });
    } else {
      this.authService
        .socialActivate({
          nickname: this.activateForm.controls.nickname.value as string,
        })
        ?.subscribe({
          next: () => {
            this.updateState({ finished: true });
          },
        });
    }
  }

  validateNickname(control: FormControl) {
    return timer(1000).pipe(
      switchMap(() => {
        return this.userService
          .checkNicknameExistance({
            nickname: control.value,
          })
          .pipe(
            map((nicknameExistance) => {
              if (nicknameExistance.exists) {
                return { existingnickname: true } as ValidationErrors;
              }

              return null;
            }),
            finalize(() => {
              this.changeDetectorRef.markForCheck();
            }),
          );
      }),
    );
  }

  override ngOnDestroy() {
    this.typing$.unsubscribe();

    this.queryParams$.unsubscribe();

    super.ngOnDestroy();
  }
}
