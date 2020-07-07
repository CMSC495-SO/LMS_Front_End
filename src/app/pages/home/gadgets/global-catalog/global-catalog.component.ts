import {Component, OnInit} from '@angular/core';
import {BaseGadgetComponent} from '../../../../component/base-gadget/base-gadget.component';

import {MatPaginator} from "@angular/material/paginator";
import {GlobalCatalogService} from "./global-catalog.service";

import * as sampleData from './sampleData.json';
import {Input} from "@angular/compiler/src/core";

@Component({
  selector: 'app-global-catalog',
  templateUrl: './global-catalog.component.html',
  styleUrls: ['./global-catalog.component.css']
})
export class GlobalCatalogComponent extends BaseGadgetComponent implements OnInit {
  catalogData: BookData[] = [];
  displayedColumns: any[] = ['id', 'title', 'author', 'categories', 'pages'];
  pageSizeOptions: number[];

  txtSearchInput: string;
  selectAll: boolean;
  selected: object[];

  constructor(private service: GlobalCatalogService) {
    super();
  }

  ngOnInit(): void {
    this.service.getBooks().subscribe((response:any) => {
      this.service.setAllBooks(response);
      this.processData(response);
    });
  }

  handleSelectAll() {

  }

  handleSelectionChange() {}

  handleSearch() {}

  processData(data) {
    if (!data || !data.length) {
      return;
    }

    this.catalogData = data.map((dataItem, index) => {
      let item: BookData = {
        id: index,
        title: dataItem.title,
        author: dataItem.author.firstName.length ? `${dataItem.author.firstName} ${dataItem.author.middleInitial}. ${dataItem.author.lastName}` : `${dataItem.author.lastName}`,
        subject: dataItem.subject,
        format: dataItem.format || '',
        price: dataItem.price,
        pages: (dataItem.numberOfPages).toString(),
        dateAdded: dataItem.addedOn ? new Date(dataItem.addedOn).toString() : '-',
        status: dataItem.status
      };

      return item;
    });
  }
}

export interface BookData {
  id: string;
  title: string;
  dateAdded: string;
  author: string;
  subject: string;
  format: string;
  price: string;
  pages: string;
  status: string;
}
