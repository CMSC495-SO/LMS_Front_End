import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {LoginComponent} from '../login/login.component';
import {StorageManager} from '../../tools/storageManager';
import {LoginService} from '../login/login.service';

@Component({
  selector: 'app-app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.css']
})
export class AppToolbarComponent implements OnInit {
  title = 'Library Management System';
  loggedInName: string;
  userInfo: any;

  @Input()
  loggedIn = false;
  loginTitle = 'Login/Signup';

  constructor(public dialog: MatDialog, private loginService: LoginService) {
  }

  openDialog() {
    const storageContainer = new StorageManager({});
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {title: 'Sign In'},
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.loginService.setUserData(this.userInfo);
    });
  }

  setToolbarNamePreferences() {
    if (this.userInfo) {
      this.loggedInName = this.capitalize(this.userInfo.firstName) + ', ' + this.capitalize(this.userInfo.lastName);
      this.loginTitle = this.loggedInName;
    }
  }

  capitalize(str: string) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1, str.length);
    }

    return '';
  }

  ngOnInit() {
    const storageContainer = new StorageManager({});
    const userItem = JSON.parse(storageContainer.getStorageItem('userdata'));

    if (userItem) {
      this.loggedIn = true;
      this.userInfo = userItem;
      this.setToolbarNamePreferences();
    }

    this.loginService.loggedIn.subscribe((item) => {
      if (item !== null) {
        this.userInfo = item;
        this.loggedIn = true;
        this.setToolbarNamePreferences();
      } else {
        this.loggedIn = false;
        this.userInfo = null;
        this.loginTitle = 'Login/Signup';
      }
    });
  }
}
