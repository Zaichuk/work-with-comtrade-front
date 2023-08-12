import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ComtradeFormComponent } from './comtrade-form/comtrade-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SvgPanComponent } from './svg-pan/svg-pan.component';
import { SvgWithButtonsComponent } from './svg-with-buttons/svg-with-buttons.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import { ComtradeComponent } from './comtrade/comtrade.component';
import { SvgComponent } from './svg/svg.component';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";

@NgModule({
  declarations: [
    AppComponent,
    ComtradeFormComponent,
    TableComponent,
    SvgPanComponent,
    SvgWithButtonsComponent,
    ComtradeComponent,
    SvgComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    RouterLink,
    RouterOutlet,
    NgDynamicBreadcrumbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
