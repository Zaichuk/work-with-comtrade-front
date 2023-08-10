import {Component, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {HttpService} from "../http.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-svg-with-buttons',
    templateUrl: './svg-with-buttons.component.html',
    styleUrls: ['./svg-with-buttons.component.css']
})
export class SvgWithButtonsComponent implements OnInit {
    svgContent: any;
    viewBoxParams = "";
    delta = 20;
    sub: Subscription = new Subscription();

    constructor(
        private sanitizer: DomSanitizer,
        private http: HttpService
    ) {
    }

    ngOnInit(): void {
        const svgPath = 'assets/Perekop.svg';

        this.sub = this.http.getSvg(svgPath).subscribe((value) => {
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(value);
            this.defineInitialViewBoxParams(value);
        });
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

    defineInitialViewBoxParams(svgString: string): void {
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

}
