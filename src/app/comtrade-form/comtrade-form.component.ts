import {Component} from '@angular/core';
import {CommunicationService} from "../communication.service";

@Component({
    selector: 'app-comtrade-form',
    templateUrl: './comtrade-form.component.html',
    styleUrls: ['./comtrade-form.component.css']
})
export class ComtradeFormComponent {
    title = 'Ввод Comtrade файла';
    selectedFile: any;

    constructor(private service: CommunicationService) {
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    onSubmit(): void {
        this.service.addFile(this.selectedFile);
    }
}
