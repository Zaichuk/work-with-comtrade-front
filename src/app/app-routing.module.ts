import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {SvgPanComponent} from "./svg-pan/svg-pan.component";
import {SvgWithButtonsComponent} from "./svg-with-buttons/svg-with-buttons.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ComtradeComponent} from "./comtrade/comtrade.component";
import {SvgComponent} from "./svg/svg.component";



const routes : Routes = [
    {path: 'home', component: ComtradeComponent},
    {path: 'svg', component: SvgComponent,
        data: {
            breadcrumb: [
                {
                    label: 'svg',
                    url: ''
                }
            ]
        },},
    {path: 'svg/pan', component: SvgPanComponent
    ,
        data: {
            breadcrumb: [
                {
                    label: 'svg',
                    url: '/svg'
                },
                {
                    label: 'panzoom',
                    url: '/svg/pan'
                }
            ]
        },
    },
    {path: 'svg/with-buttons', component: SvgWithButtonsComponent,
        data: {
            title: 'page3',
            breadcrumb: [
                {
                    label: 'svg',
                    url: '/svg'
                },
                {
                    label: 'with-buttons',
                    url: '/svg/with-buttons'
                },

            ]
        },},
    {path: '', pathMatch: 'full', redirectTo: 'home'}
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      RouterModule.forRoot(routes)
  ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
