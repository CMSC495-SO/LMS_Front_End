import {Component, OnInit} from '@angular/core';
import {BookData} from '../../tools/book-data';
import {MessageDialogComponent} from '../../tools/message-dialog/message-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-base-gadget',
  templateUrl: './base-gadget.component.html',
  styleUrls: ['./base-gadget.component.css']
})
export class BaseGadgetComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  handleSearchKeyup(evt: any) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      this.handleSearch();
    }
  }

  handleSearch() {
  }

  showAlertMessage(msg, tit) {
    return this.dialog.open(MessageDialogComponent, {data: {title: tit, message: msg}, minWidth: '35vw'});
  }

  processData(resource) {
    if (!resource || !resource.length) {
      return;
    }

    return resource.map((dataItem, index) => {
      const item: BookData = {
        id: dataItem._id,
        title: dataItem.title,
        author: dataItem.author.middleInitial.length ?
          `${dataItem.author.firstName} ${dataItem.author.middleInitial}. ${dataItem.author.lastName}` :
          `${dataItem.author.firstName} ${dataItem.author.lastName}`,
        subject: dataItem.subject,
        format: dataItem.format || '',
        price: dataItem.price,
        pages: (dataItem.numberOfPages).toString(),
        dateAdded: dataItem.addedOn ? new Date(dataItem.addedOn).toString() : '-',
        status: dataItem.status,
        ISBN: dataItem.ISBN,
        isAvailable: dataItem.status === 'available',
        isOnLoan: dataItem.status === 'loaned'
      };

      return item;
    });
  }
}
