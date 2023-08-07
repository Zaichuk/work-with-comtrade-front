import {Component} from '@angular/core';
import {CommunicationService} from "../communication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-comtrade-form',
    templateUrl: './comtrade-form.component.html',
    styleUrls: ['./comtrade-form.component.css']
})
export class ComtradeFormComponent {
    title = 'Ввод Comtrade файла';
    selectedFile: any;
    form: FormGroup;

    constructor(private service: CommunicationService) {
        this.form = new FormGroup({
            file: new FormControl(
                '',
                [Validators.required]
            )
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];

        this.selectedFile = file;
        this.form.get('file')?.setValue(
          file
        );
    }

    onSubmit(): void {
        this.service.addFile(this.selectedFile);
    }
}
