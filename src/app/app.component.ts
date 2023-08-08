import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
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
    viewBoxParams = "";
    delta = 20;

    constructor(
        private sanitizer: DomSanitizer,
        private transfer: CommunicationService,
        private http: HttpService
    ) {
    }

    ngOnInit(): void {
        const svgPath = 'assets/Perekop.svg';

        this.sub[0] = this.transfer.file$.subscribe((value) => {
            this.file = value;
            this.getMeasurements();
        });

        this.sub[2] = this.http.getSvg(svgPath).subscribe((value) => {
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(value);
            this.defineInitialViewBoxParams(value);
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

    changeSvgContentAndViewBoxParams(
        viewBoxParams: string
    ): void {
        const viewBoxFormatter = (
            viewBoxParams: string
        ): string => {
            return 'viewBox=\"' + viewBoxParams + '\"'
        };
        let sanitizedSvgContent = this.sanitizer.sanitize(
            SecurityContext.HTML,
            this.svgContent
        );

        if (sanitizedSvgContent !== null) {
            sanitizedSvgContent = sanitizedSvgContent.replace(
                viewBoxFormatter(this.viewBoxParams),
                viewBoxFormatter(viewBoxParams)
            );
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(
                sanitizedSvgContent
            );
            this.viewBoxParams = viewBoxParams;
        } else {
            throw new Error("Svg is null");
        }
    }

    changeViewBoxParams(
        parameter: number,
        typeOperation: string,
    ): string {
        let strings = this.viewBoxParams.split(" ");
        let val: number = 0;

        switch (typeOperation) {
            case 'sum':
                val = parseInt(strings[parameter]) + this.delta;
                break;
            case 'div':
                val = parseInt(strings[parameter]) - this.delta;
                break;
            default:
                throw new Error('Illegal argument');
        }
        strings[parameter] = val.toString();

        return strings.join(" ");
    }

    changeViewBoxWidthAndHeight(
        typeOperation: string,
    ): string {
        let strings = this.viewBoxParams.split(" ");
        let width: number = 0;
        let height: number = 0;

        switch (typeOperation) {
            case 'sum':
                width = parseInt(strings[2]) + this.delta;
                height = parseInt(strings[3]) + this.delta;
                break;
            case 'div':
                width = parseInt(strings[2]) - this.delta;
                height = parseInt(strings[3]) - this.delta;
                break;
            default:
                throw new Error('Illegal argument');
        }
        strings[2] = width.toString();
        strings[3] = height.toString();

        return strings.join(" ");
    }

    defineInitialViewBoxParams(svgString: string):void {
        const viewBoxRegex = /viewBox="([^"]*)"/;
        let results = viewBoxRegex.exec(
            svgString
        );

        if (results !== null) {
            this.viewBoxParams = results[1];
        } else {
            throw new Error("ViewBox params not found");
        }
    }

    moveRight() {
        let viewBoxParams = this.changeViewBoxParams(
            0,
            "div"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    moveLeft() {
        let viewBoxParams = this.changeViewBoxParams(
            0,
            "sum"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    moveUp() {
        let viewBoxParams = this.changeViewBoxParams(
            1,
            "sum"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    moveDown() {
        let viewBoxParams = this.changeViewBoxParams(
            1,
            "div"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    zoomIn() {
        let viewBoxParams = this.changeViewBoxWidthAndHeight(
            "div"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    zoomOut() {
        let viewBoxParams = this.changeViewBoxWidthAndHeight(
            "sum"
        );
        this.changeSvgContentAndViewBoxParams(viewBoxParams);
    }

    ngOnDestroy(): void {
        this.sub.forEach((el) => {
                el.unsubscribe();
            }
        );
    }
}
