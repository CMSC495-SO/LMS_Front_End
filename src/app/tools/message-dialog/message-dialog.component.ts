import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface MessageDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  title;
  message;

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: MessageDialogData) { }

  ngOnInit(): void {
    this.title = this.data.title || 'Message';
    this.message = this.data.message || 'Testing messages';
  }

  close() {
    this.dialogRef.close();
  }
}
