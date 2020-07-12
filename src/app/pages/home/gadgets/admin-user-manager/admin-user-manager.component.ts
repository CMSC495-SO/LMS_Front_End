import { Component, OnInit } from '@angular/core';
import {BaseGadgetComponent} from '../../../../component/base-gadget/base-gadget.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginService} from '../../../../component/login/login.service';
import {StorageManager} from '../../../../tools/storageManager';

@Component({
  selector: 'app-admin-user-manager',
  templateUrl: './admin-user-manager.component.html',
  styleUrls: ['./admin-user-manager.component.css']
})
export class AdminUserManagerComponent extends BaseGadgetComponent implements OnInit {
  activeId: string;
  renderData: any[];
  searchBy: string;
  txtSearchUsers: string;

  allUsers: any[];

  constructor(private d: MatDialog, private service: LoginService) {
    super(d);
  }

  ngOnInit(): void {
    const store = new StorageManager({});
    this.activeId = JSON.parse(store.getStorageItem('userdata')).id;
    this.fetchData();
    this.handleSearch();
  }

  fetchData() {
    this.service.getAllUsers({userId: this.activeId}).subscribe((items) => {
      if (items.statusCode !== 200) {
        this.showAlertMessage(items.message, 'Error');
      }
      this.allUsers = items;
    });
  }

  handleSearch() {
    this.renderData = this.allUsers.filter((item) => {
      if (this.txtSearchUsers && this.txtSearchUsers.length) {
        if (item[this.searchBy].indexOf(this.txtSearchUsers) !== -1) {
          return item;
        }
      } else {
        return item;
      }
    });
  }

}
