import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommunicationService} from "./communication.service";
import {HttpService} from "./http.service";
import {Subscription} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";

export class Measurement {
    id: number;
    ia: number;
    ib: number;
    ic: number;

    constructor(id: number, ia: number, ib: number, ic: number) {
        this.id = id;
        this.ia = ia;
        this.ib = ib;
        this.ic = ic;
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'work-with-comtrade-front';
    file: any;
    measurements: Measurement[] = [];
    sub: Subscription[] = [
        new Subscription(),
        new Subscription(),
        new Subscription()
    ];
    isTableVisible = false;
    svgContent: any;

    constructor(
        private sanitizer: DomSanitizer,
        private transfer: CommunicationService,
        private http: HttpService
    ) {
    }

    ngOnInit(): void {
        const svgPath = 'assets/logo11.svg';

        this.sub[0] = this.transfer.file$.subscribe((value) => {
            this.file = value;
            this.getMeasurements();
        });

        this.sub[2] = this.http.getSvg(svgPath).subscribe((value) => {
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(value);
        });
    }

    uploadFile(): void {
        this.http.uploadFile(this.file);
    }

    getMeasurements(): void {
        this.uploadFile();

        this.sub[1] = this.http.getMeasurements().subscribe((value) => {
            this.measurements = value;
            this.transfer.addMeasurements(this.measurements);
        });
        this.isTableVisible = true;
    }

    ngOnDestroy(): void {
        this.sub.forEach((el) => {
                el.unsubscribe();
            }
        );
    }
}
