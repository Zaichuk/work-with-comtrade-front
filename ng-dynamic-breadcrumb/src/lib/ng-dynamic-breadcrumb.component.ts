import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, RoutesRecognized} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {Breadcrumb} from './breadcrumb.model';
import {NgDynamicBreadcrumbService} from './ng-dynamic-breadcrumb.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-ng-dynamic-breadcrumb',
    templateUrl: './ng-dynamic-breadcrumb.component.html',
    styleUrls: ['./ng-dynamic-breadcrumb.component.css']
})
export class NgDynamicBreadcrumbComponent implements OnInit {

    breadcrumb: Breadcrumb[] = [];
    @Input() bgColor = '#eee';
    @Input() fontSize = '18px';
    @Input() fontColor = '#0275d8';
    @Input() lastLinkColor = '#000';
    @Input() symbol = ' / ';
    params: { [key: string]: any; } | any;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService
    ) {
        this.breadCrumbData();
    }

    ngOnInit() {
        this.ngDynamicBreadcrumbService.breadcrumbLabels.subscribe((labelData) => {
            for (const label in labelData) {
                if (labelData.hasOwnProperty(label)) {
                    this.breadcrumb.map((crumb) => {
                        const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
                        if (labelParams) {
                            for (const labelParam of labelParams) {
                                const dynamicData = labelData[label];
                                if (labelParam === label) {
                                    crumb.label = crumb.label.replace('{{' + labelParam + '}}', dynamicData);
                                }
                            }
                        }
                    });
                }
            }
        });

        this.ngDynamicBreadcrumbService.newBreadcrumb.subscribe((breadcrumb: Breadcrumb[]) => {
            if (breadcrumb.length > 0) {
                this.updateData(this.activatedRoute, breadcrumb);
            }
        });
    }

    breadCrumbData(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .pipe(map(() => this.activatedRoute))
            .pipe(map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }))
            .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
            .subscribe(route => {
                this.params = route.snapshot.params;
                this.updateData(route, null);
            });
    }

    private updateData(route: any, newBreadcrumb: any): void {
        if (route.snapshot.data.breadcrumb || newBreadcrumb) {
            const data = route.snapshot.data.breadcrumb ? route.snapshot.data.breadcrumb : newBreadcrumb;
            const breadcrumb = (JSON.parse(JSON.stringify(data)));
            breadcrumb.map((crumb: any) => {

                const urlChunks = crumb.url.split('/');
                for (const chunk of urlChunks) {
                    if (chunk.includes(':')) {
                        const paramID = chunk.replace(':', '');
                        // const routerParamID = route.snapshot.params[paramID];
                        const routerParamID = this.params[paramID];
                        crumb.url = crumb.url.replace(`:${paramID}`, routerParamID);
                    }
                }

                const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
                if (labelParams) {
                    for (const labelParam of labelParams) {
                        // const routerParamID = route.snapshot.params[labelParam.trim()];
                        const routerParamID = this.params[labelParam.trim()];
                        if (routerParamID) {
                            crumb.label = crumb.label.replace('{{' + labelParam + '}}', routerParamID);
                        } else {
                            // crumb.label = crumb.label.replace('{{' + labelParam + '}}', '');
                        }
                    }
                }

            });
            this.breadcrumb = breadcrumb;
        } else {
            this.breadcrumb = [];
        }
    }
}

