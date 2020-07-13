import {Component, Input, OnInit} from '@angular/core';
import {BaseGadgetComponent} from '../../../../component/base-gadget/base-gadget.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginService} from '../../../../component/login/login.service';
import {EditUserDialogComponent} from '../../../../component/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-admin-user-manager',
  templateUrl: './admin-user-manager.component.html',
  styleUrls: ['./admin-user-manager.component.css', '../../../../component/base-gadget/base-gadget.component.css']
})
export class AdminUserManagerComponent extends BaseGadgetComponent implements OnInit {
  renderData: any[];
  @Input()
  searchBy = 'userName';
  @Input()
  txtSearchUsers: string;

  allUsers: any[];

  constructor(private d: MatDialog, private service: LoginService) {
    super(d);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.service.getAllUsers().subscribe((items: any) => {
      if (items.statusCode !== 200) {
        this.showAlertMessage(items.message, 'Error');
      }
      this.allUsers = items.data;
      this.handleSearch();
    });
  }

  getDate(str: string) {
    if (!str) {
      return '-';
    }

    return new Date(str);
  }

  addUserRole(role: string, id: string) {
    const dataItem = this.allUsers.find(x => x._id === id);

    if (dataItem.roles && dataItem.roles.indexOf(role) !== -1) {
      return;
    }

    if (dataItem.roles && Array.isArray(dataItem.roles)) {
      dataItem.roles.push(role);
    } else {
      dataItem.roles = [role];
    }

    this.service.updateUser({toUpdate: dataItem, updatedBy: null}).subscribe(this.handleUpdateComplete.bind(this));
  }

  handleUpdateComplete(response: any) {
    if (response.statusCode !== 200) {
      this.showAlertMessage(response.message, 'Error');
      return;
    }
    this.showAlertMessage(response.message, 'Success');
    this.fetchData();
  }

  editItem(itemId) {
    const ref = this.d.open(EditUserDialogComponent, {
      data: this.allUsers.find((x: any) => {
        return x._id === itemId;
      }),
      width: '40vw'
    });

    ref.afterClosed().subscribe((data) => {
      if (data) {
        this.service.updateUser({toUpdate: data.data, updatedBy: null}).subscribe(this.handleUpdateComplete.bind(this));
        return;
      }

      this.fetchData();
    });
  }

  deleteItem(itemId: string) {
    this.service.deleteUser({itemId}).subscribe(this.handleUpdateComplete.bind(this));
  }

  removeUserRole(role: string, id: string) {
    const dataItem = this.allUsers.find(x => x._id === id);

    dataItem.roles = (dataItem.roles || []).map(x => x !== role ? x : null).filter(x => x);

    this.service.updateUser({toUpdate: dataItem, updatedBy: null}).subscribe(this.handleUpdateComplete.bind(this));
  }

  handleSearch() {
    this.renderData = this.allUsers.filter((item) => {
      if (this.txtSearchUsers && this.txtSearchUsers.length) {
        if (item[this.searchBy].toLowerCase().indexOf(this.txtSearchUsers.toLowerCase()) !== -1) {
          return item;
        }
      } else {
        return item;
      }
    });
  }
}
