import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommunicationService} from "../communication.service";
import {Measurement} from "../app.component";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
    measurements: Measurement[] = [];
    sub: Subscription = new Subscription();

    constructor(private transfer: CommunicationService) {
    }

    ngOnInit(): void {
        this.sub = this.transfer.measurements$.subscribe((value) => {
            this.measurements = value;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
