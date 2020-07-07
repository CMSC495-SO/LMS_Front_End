import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*custom modules*/
import { AppRoutingModule } from './app-routing.module';

/*imported components*/
import { AppComponent } from './app.component';
import { FooterComponent } from './component/footer/footer.component';
import { AppToolbarComponent } from './component/app-toolbar/app-toolbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { LoginComponent } from './component/login/login.component';

/*providers*/
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { BaseGadgetComponent } from './component/base-gadget/base-gadget.component';
import {BaseGadgetDirective} from './component/base-gadget/base-gadget.directive';
import { GlobalCatalogComponent } from './pages/home/gadgets/global-catalog/global-catalog.component';
import {MatTableModule} from "@angular/material/table";
import {DemoMaterialModule} from "./material-module";


@NgModule({
  declarations: [
    AppComponent,
    SampleComponent,
    FooterComponent,
    AppToolbarComponent,
    HomeComponent,
    AboutusComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    BaseGadgetComponent,
    BaseGadgetDirective,
    GlobalCatalogComponent,
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    DemoMaterialModule
  ],
  providers: [MatDialog, MatPaginator],
  bootstrap: [AppComponent]
})
export class AppModule { }
