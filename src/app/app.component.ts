import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommunicationService} from "./communication.service";
import {HttpService} from "./http.service";
import {Subscription} from "rxjs";

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
    sub1: Subscription = new Subscription();
    sub2: Subscription = new Subscription();

    constructor(
        private transfer: CommunicationService,
        private http: HttpService
    ) {
    }

    ngOnInit(): void {
        this.sub1 = this.transfer.file$.subscribe((value) => {
            this.file = value;
            this.getMeasurements();
        });
    }

    uploadFile(): void {
        this.http.uploadFile(this.file);
    }

    getMeasurements(): void {
        this.uploadFile();

        this.sub2 = this.http.getMeasurements().subscribe((value) => {
            this.measurements = value;
            this.transfer.addMeasurements(this.measurements);
            console.log(value);
        });
    }

    ngOnDestroy(): void {
        this.sub1.unsubscribe();
        this.sub2.unsubscribe();
    }
}
