import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Directive({
  selector: '[insufficientItems]',
  standalone: true,
  exportAs: 'insufficientItems',
})
export class InsufficientItemsDirective implements OnChanges {
  @Input({ required: true }) existingItems!: number;
  @Input({ required: true }) containerRef!: HTMLElement;
  @Output() loadMoreItems: EventEmitter<void> = new EventEmitter();

  previousExistingItems?: number;

  ngOnChanges() {
    requestAnimationFrame(() => {
      if (
        this.existingItems &&
        this.existingItems !== this.previousExistingItems &&
        this.containerRef.clientHeight === this.containerRef.scrollHeight
      ) {
        this.previousExistingItems = this.existingItems;

        this.loadMoreItems.emit();
      }
    });
  }
}
