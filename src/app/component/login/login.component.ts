import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {LoginService} from './login.service';
import {StorageManager} from '../../tools/storageManager';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'Sign in to Library';
  activeTab: string = 'login';

  @Input()
  isLoggedIn = false;

  emailAddress: string = '';
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  password: string = '';

  message: string;
  userNameValid: boolean = true;
  loginFieldsValid: boolean = this.userNameValid && this.userName.length > 0 && this.password.length > 0;
  signUpFieldsValid: boolean = this.loginFieldsValid && this.firstName.length > 0
    && this.lastName.length > 0 && this.emailAddress.length > 0;
  showMessage = false;

  constructor(private service: LoginService, public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  resetFields() {
    this.userName = '';
    this.password = '';
    this.emailAddress = '';
    this.firstName = '';
    this.lastName = '';
  }

  ngOnInit() {
    const item = this.service.getUserData();

    this.isLoggedIn = item && item.hasOwnProperty('userName');
  }

  performLogoutAction() {
    this.service.logoutUser();
    this.service.loggedIn.emit(null);
    this.dialogRef.close();
  }

  performLoginAction() {
    this.service.loginUser({userName: this.userName, password: this.password}).subscribe((response: any) => {
      const storage = new StorageManager({});

      if (!response.matched) {
        this.updateMessage(response.message);

        return;
      }

      this.service.loggedIn.emit(response.user);
      //need to store response data
      storage.add('userdata', JSON.stringify(response.user));
      this.service.setUserData();
      this.dialogRef.close();
    });
  }

  performUserSignUp() {
    const data = {
      userName: this.userName,
      password: this.password,
      emailAddress: this.emailAddress,
      firstName: this.firstName,
      lastName: this.lastName
    };
    /*looking for a time stamp for when the user was added as well here.*/
    this.service.signUp(data).subscribe((response: any) => {
      const storage = new StorageManager({});
      if (!response.matched) {
        this.updateMessage(response.message);
        return;
      }
      //need to store response data
      storage.add('userdata', JSON.stringify(response.user));
      this.service.loggedIn.emit(response.user);
      this.dialogRef.close();
    });
  }

  updateMessage(message) {
    let _this = this;

    _this.message = message;
    _this.showMessage = true;

    setTimeout(() => {
      _this.showMessage = false;
    }, 15000);
  }

  checkUserName() {
    if (!this.userName.length) {
      return false;
    }
    this.service.checkUserNameValid({userName: this.userName}).subscribe((response: any) => {
      this.userNameValid = response.isValid === 0;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  setActiveTab(name) {
    if (this.activeTab !== name) {
      this.resetFields();
      this.activeTab = name;
    }
  }
}
