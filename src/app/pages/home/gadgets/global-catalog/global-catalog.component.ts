import {Component, Input, OnInit} from '@angular/core';
import {BaseGadgetComponent} from '../../../../component/base-gadget/base-gadget.component';

import {GlobalCatalogService} from './global-catalog.service';
import {BookData} from '../../../../tools/book-data';
import {LoginService} from '../../../../component/login/login.service';
import {LoginComponent} from '../../../../component/login/login.component';
import {MatDialog} from '@angular/material/dialog';
import {StorageManager} from '../../../../tools/storageManager';

@Component({
  selector: 'app-global-catalog',
  templateUrl: './global-catalog.component.html',
  styleUrls: ['./global-catalog.component.css', '../../../../component/base-gadget/base-gadget.component.css']
})
export class GlobalCatalogComponent extends BaseGadgetComponent implements OnInit {
  allData = [];
  catalogData: BookData[] = [];
  isLoggedIn;

  @Input()
  txtSearchInput = '';
  @Input()
  searchBy = 'title';

  constructor(private service: GlobalCatalogService, private lgnService: LoginService, private d: MatDialog) {
    super(d);
  }

  ngOnInit(): void {
    this.loadBookItems();
    this.lgnService.loggedIn.subscribe((item) => {
      this.isLoggedIn = !!item;
    });
    this.isLoggedIn = this.lgnService.isUserLoggedIn();
  }

  loadBookItems() {
    this.service.getBooks().subscribe((response: any) => {
      this.service.setAllBooks(response);
      this.allData = this.processData(response);
      this.handleSearch();
    });
  }

  handleSearch() {
    this.catalogData = this.allData.filter((item) => {
      if (!this.txtSearchInput.length) {
        return item;
      }

      if (item.hasOwnProperty(this.searchBy) &&
          item[this.searchBy].toLowerCase().indexOf(this.txtSearchInput.toLowerCase()) !== -1) {
          return item;
      }
    });
  }

  performLoginAction() {
    this.dialog.open(LoginComponent, {});
  }

  reserveItem() {
    this.showAlertMessage('Feature currently unavailable', 'Feature Coming Soon');
  }

  checkOutItem(itemId) {
    const storage = new StorageManager({});
    const params = {
      userId: JSON.parse(storage.getStorageItem('userdata')).userName,
      bookId: itemId
    };

    console.log('trying to checkout %s', itemId);
    this.service.checkoutItem(params).subscribe((response: any) => {
      const isFailure = response.statusCode !== 200;

      if (response.hasOwnProperty('message')) {
        this.showAlertMessage(response.message, isFailure ? 'Error' : 'Success');
      }

      this.loadBookItems();
    });
  }
}

