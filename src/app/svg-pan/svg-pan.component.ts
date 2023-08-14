import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {CommunicationService} from "../communication.service";
import {HttpService} from "../http.service";
import {Subscription} from "rxjs";
import panzoom from "panzoom";


@Component({
    selector: 'app-svg-pan',
    templateUrl: './svg-pan.component.html',
    styleUrls: ['./svg-pan.component.css']
})
export class SvgPanComponent implements OnInit, AfterViewInit {
    svgContent: any;
    sub: Subscription = new Subscription();
    @ViewChild('svg', {static: false}) svg: any;

    constructor(
        private sanitizer: DomSanitizer,
        private transfer: CommunicationService,
        private http: HttpService
    ) {
    }

    ngOnInit(): void {
        const svgPath = 'assets/Perekop.svg';

        this.sub = this.http.getSvg(svgPath).subscribe((value) => {
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(value);
        });
    }

    ngAfterViewInit(): void {
        panzoom(this.svg.nativeElement);
    }
}
