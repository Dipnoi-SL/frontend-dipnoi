import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ProposalService } from '../../../services/proposal.service';
import { DialogRef } from '@angular/cdk/dialog';
import { StatefulComponent } from '../../../directives/stateful-component.directive';
import { ProposalCategoryEnum } from '../../../constants/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutePathEnum } from '../../../app.routes';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dipnoi-proposal-creation',
  standalone: true,
  templateUrl: './proposal-creation.component.html',
  styleUrl: './proposal-creation.component.scss',
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreationComponent
  extends StatefulComponent<{
    thumbnailSrc: string;
    thumbnail?: File;
    proposalId?: number;
  }>
  implements OnInit, OnDestroy
{
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
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ];

  constructor(
    public formBuilder: NonNullableFormBuilder,
    public proposalService: ProposalService,
    public dialogRef: DialogRef<ProposalCreationComponent>,
    public router: Router,
    public route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    super({ thumbnailSrc: '' });
  }

  ngOnInit() {
    this.editor = new Editor();

    this.editor$ = this.editor.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  addPollLabelsControl() {
    this.creationForm.controls.pollLabels.push(
      this.formBuilder.control('', Validators.required),
    );
  }

  removePollLabelsControl(index: number) {
    this.creationForm.controls.pollLabels.removeAt(index);
  }

  onSubmit() {
    if (this.state.proposalId) {
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
            this.updateState({ proposalId: proposal.id });

            this.uploadThumbnail();
          },
        });
    }
  }

  uploadThumbnail() {
    if (this.state.thumbnail) {
      this.proposalService
        .createOrUpdateOneThumbnail({
          id: this.state.proposalId!,
          thumbnail: this.state.thumbnail,
        })
        ?.subscribe({
          next: () => {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { [RoutePathEnum.PROPOSAL]: this.state.proposalId },
              queryParamsHandling: 'merge',
            });
          },
        });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [RoutePathEnum.PROPOSAL]: this.state.proposalId },
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
    this.editor.destroy();

    this.editor$.unsubscribe();

    super.ngOnDestroy();
  }
}
