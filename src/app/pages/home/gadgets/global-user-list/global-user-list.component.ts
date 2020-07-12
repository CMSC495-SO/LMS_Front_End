import {Component, Input, OnInit} from '@angular/core';
import {BookData} from '../../../../tools/book-data';
import {LoginService} from '../../../../component/login/login.service';
import {StorageManager} from '../../../../tools/storageManager';
import {GlobalCatalogService} from '../global-catalog/global-catalog.service';
import {BaseGadgetComponent} from '../../../../component/base-gadget/base-gadget.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-global-user-list',
  templateUrl: './global-user-list.component.html',
  styleUrls: ['./global-user-list.component.css', '../../../../component/base-gadget/base-gadget.component.css']
})
export class GlobalUserListComponent extends BaseGadgetComponent implements OnInit {
  allInUserCatalog: BookData[];
  userCatalogData: BookData[];
  firstName: string;

  @Input() searchBy = 'title';
  @Input() txtSearchInput = '';

  userData: any;

  constructor(private loginService: LoginService, private service: GlobalCatalogService, private d: MatDialog) {
    super(d);
  }

  ngOnInit(): void {
    const store = new StorageManager({});
    this.userData = JSON.parse(store.getStorageItem('userdata'));
    this.loginService.loggedIn.subscribe(this.handleLoginSubscription.bind(this));
    this.fetchData();
    this.setFieldData();
  }

  fetchData() {
    const params = {
      userId: this.userData.id
    };
    this.service.getCurrentUserCatalog(params).subscribe((items: any) => {
      this.allInUserCatalog = this.processData(items.data);
      this.handleSearch();
    });
  }

  setFieldData() {
    if (this.userData) {
      this.firstName = this.userData.firstName;
    } else {
      this.firstName = 'User';
    }
  }

  returnItem(itemId) {
    const params = {userName: this.userData.userName, bookId: itemId};

    this.service.returnBook(params).subscribe((item: any) => {
      this.showAlertMessage(item.message, item.statusCode === 200 ? 'Success' : 'Error');
      if (item.statusCode === 200) {
        this.fetchData();
      }
    });
  }

  handleLoginSubscription(userData) {
    this.userData = userData;
    this.setFieldData();
  }

  handleSearch() {
    this.userCatalogData = this.allInUserCatalog.filter((item) => {
      if (!this.txtSearchInput.length) {
        return item;
      }

      if (item.hasOwnProperty(this.searchBy) &&
        item[this.searchBy].toLowerCase().indexOf(this.txtSearchInput.toLowerCase()) !== -1) {
        return item;
      }
    });
  }
}
