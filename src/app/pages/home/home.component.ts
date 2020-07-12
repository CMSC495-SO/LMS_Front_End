import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, HostBinding} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StorageManager} from '../../tools/storageManager';

import {BaseGadgetDirective} from '../../component/base-gadget/base-gadget.directive';
import {GlobalCatalogComponent} from './gadgets/global-catalog/global-catalog.component';
import {GlobalUserListComponent} from './gadgets/global-user-list/global-user-list.component';

import {LoginService} from 'src/app/component/login/login.service';
import {MessageDialogComponent} from '../../tools/message-dialog/message-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @HostBinding('class.user-logged-in')
  userData = null;

  sideBarButtons: any[];
  @Input() component;

  @ViewChild(BaseGadgetDirective, {static: true}) gadgetHost: BaseGadgetDirective;

  loggedIn = false;
  user: any = {isAdmin: false, isLibrarian: false};
  activeComponent = 'globalComponent';

  constructor(private dialog: MatDialog, private componentFactoryResolver: ComponentFactoryResolver, private loginService: LoginService) {
  }

  ngOnInit(): void {
    const storage = new StorageManager({});

    this.userData = JSON.parse(storage.getStorageItem('userdata'));
    if (this.userData) {
      this.loginService.loggedIn.emit(this.userData);
      this.loggedIn = true;
      this.loginService.setUserData(this.userData);
      if (this.userData.hasOwnProperty('roles')) {
        this.user.isAdmin = this.userData.roles.indexOf('admin') !== -1;
        this.user.isLibrarian = this.userData.roles.indexOf('librarian') !== -1;
      }
    }

    this.setSidebarButtons();
    this.bindServiceSubscriptions();
    this.loadComponent(GlobalCatalogComponent);
  }

  bindServiceSubscriptions() {
    this.loginService.loggedIn.subscribe((item) => {
      if (item) {
        this.userData = item;
      } else {
        this.userData = null;
        this.user.isAdmin = false;
        this.user.isLibrarian = false;
        this.closeUserComponent();
      }
      this.setSidebarButtons();
    });
  }

  closeUserComponent() {
    this.activeComponent = 'globalCatalog';
    this.openLibraryComponent('globalCatalog');
    this.setSidebarButtons();
  }

  setSidebarButtons() {
    if (this.userData) {
      this.sideBarButtons = [
        {
          name: this.userData && this.userData.userName.length ? `${this.userData.firstName}'s Catalog` : 'User\'s Catalog',
          componentName: 'userCatalog',
          isVisible: this.userData && this.userData.userName.length
        },
        {
          name: 'Admin Book Manager',
          componentName: 'bookManager',
          isVisible: this.userData && this.userData.hasOwnProperty('roles') ? this.userData.roles.includes('admin' || 'librarian') : false
        },
        {
          name: 'Admin User Manager',
          componentName: 'userManager',
          isVisible: this.userData && this.userData.hasOwnProperty('roles') ?
            this.userData.roles.indexOf('admin') || this.userData.roles.indexOf('librarian') : false
        }
      ];

      return;
    }
    this.sideBarButtons = [];
  }

  openLibraryComponent(componentName) {
    if (componentName && componentName === this.activeComponent) {
      return;
    }

    switch (componentName) {
      case 'bookManager':
      case 'userManager':
        this.showAlertMessage('Feature is currently in development, please try again later', 'Feature currently unavailable');
        break;
      case 'userCatalog':
        this.activeComponent = componentName;
        this.loadComponent(GlobalUserListComponent);
        break;
      case 'globalCatalog':
      default:
        this.activeComponent = componentName;
        this.loadComponent(GlobalCatalogComponent);
        break;
    }
  }

  loadComponent(comp) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(comp);
    const vcr = this.gadgetHost.vcr;

    vcr.clear();

    this.component = vcr.createComponent(componentFactory);
  }

  getButtonTitle(): string {
    return `${this.userData ? this.userData.firstName + '\'' : ''}`;
  }

  showAlertMessage(msg, tit) {
    return this.dialog.open(MessageDialogComponent, {data: {title: tit, message: msg}});
  }
}
