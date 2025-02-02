import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent {
  @Input() bookTitle: string = '';
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<string>();

  commentText: string = '';

  closeDialog() {
    this.onClose.emit();
    this.commentText = '';
  }

  submitComment() {
    if (this.commentText.trim()) {
      this.onSubmit.emit(this.commentText);
      this.commentText = '';
      this.closeDialog();
    }
  }
}