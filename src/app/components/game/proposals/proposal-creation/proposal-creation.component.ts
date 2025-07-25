import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Subscription, finalize } from 'rxjs';
import { StatefulComponent } from '../../../../directives/stateful-component.directive';
import { ProposalCategoryEnum } from '../../../../constants/enums';
import { ProposalService } from '../../../../services/proposal.service';
import { RoutePathEnum } from '../../../../app.routes';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dipnoi-proposal-creation',
  standalone: true,
  templateUrl: './proposal-creation.component.html',
  styleUrl: './proposal-creation.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    NgxSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreationComponent
  extends StatefulComponent<{
    thumbnailSrc: string;
    thumbnail?: File;
    createdProposalId?: number;
    isCreateProposalLoading: boolean;
  }>
  implements OnInit, OnDestroy
{
  @ViewChild('pollSection', { static: false }) pollSectionRef!: ElementRef;

  categories = [
    ProposalCategoryEnum.ALGORITHMICS,
    ProposalCategoryEnum.BUG,
    ProposalCategoryEnum.UI,
  ];
  creationForm = this.formBuilder.group({
    initialTitle: ['', Validators.required],
    initialDescription: ['', Validators.required],
    pollLabels: this.formBuilder.array([] as string[]),
    thumbnail: ['', [Validators.required, this.validateImageType]],
    categories: this.formBuilder.array(
      this.categories.map(() => this.formBuilder.control(false)),
    ),
  });
  editor$!: Subscription;
  spinners$!: Subscription;
  editor!: Editor;
  toolbar: Toolbar = [
    [
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code',
      'bullet_list',
      'ordered_list',
      'image',
      'text_color',
      'background_color',
      'format_clear',
    ],
    [{ heading: ['h3', 'h4', 'h5', 'h6'] }],
  ];

  constructor(
    public formBuilder: NonNullableFormBuilder,
    public proposalService: ProposalService,
    public dialogRef: DialogRef<ProposalCreationComponent>,
    public router: Router,
    public route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public spinnerService: NgxSpinnerService,
  ) {
    super({ thumbnailSrc: '', isCreateProposalLoading: false });
  }

  ngOnInit() {
    this.editor = new Editor();

    this.editor$ = this.editor.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    this.spinners$ = this.state$.subscribe((state) => {
      if (state.isCreateProposalLoading) {
        this.spinnerService.show('create-proposal');
      } else {
        this.spinnerService.hide('create-proposal');
      }
    });
  }

  addPollLabelsControl() {
    this.creationForm.controls.pollLabels.push(
      this.formBuilder.control('', Validators.required),
    );

    requestAnimationFrame(() => {
      const newInput: HTMLElement[] =
        this.pollSectionRef.nativeElement.querySelectorAll('input');

      newInput[newInput.length - 1]?.focus();
    });
  }

  removePollLabelsControl(index: number) {
    this.creationForm.controls.pollLabels.removeAt(index);
  }

  onSubmit() {
    this.updateState({ isCreateProposalLoading: true });

    if (this.state.createdProposalId) {
      this.uploadThumbnail();
    } else {
      this.proposalService
        .createOne({
          initialTitle: this.creationForm.controls.initialTitle.value,
          initialDescription:
            this.creationForm.controls.initialDescription.value,
          pollLabels: this.creationForm.controls.pollLabels.value,
          categories: this.categories.filter(
            (_, index) => this.creationForm.controls.categories.value[index],
          ),
        })
        ?.subscribe({
          next: (proposal) => {
            this.updateState({ createdProposalId: proposal.id });

            this.uploadThumbnail();
          },
        });
    }
  }

  uploadThumbnail() {
    if (this.state.thumbnail) {
      this.proposalService
        .createOrUpdateOneThumbnail({
          thumbnail: this.state.thumbnail,
        })
        ?.pipe(
          finalize(() => {
            this.updateState({ isCreateProposalLoading: false });
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                [RoutePathEnum.SELECTED_PROPOSAL]: this.state.createdProposalId,
              },
              queryParamsHandling: 'merge',
            });
          },
        });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          [RoutePathEnum.SELECTED_PROPOSAL]: this.state.createdProposalId,
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFileChange(event: Event) {
    const reader = new FileReader();

    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length) {
      const file = target.files.item(0);

      if (file) {
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.updateState({
            thumbnailSrc: reader.result as string,
            thumbnail: file,
          });
        };
      }
    }
  }

  validateImageType(control: FormControl) {
    const file = control.value;

    if (file) {
      const allowedExtensions = ['png', 'jpg', 'jpeg'];

      const extension = file.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return { invalidFileType: true } as ValidationErrors;
      }
    }

    return null;
  }

  override ngOnDestroy() {
    this.spinners$.unsubscribe();

    this.editor.destroy();

    this.editor$.unsubscribe();

    super.ngOnDestroy();
  }
}
