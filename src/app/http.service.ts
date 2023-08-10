import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Measurement} from "./app.component";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private client: HttpClient) {
    }

    uploadFile(file: File): void {
        const formData = new FormData();
        formData.append('file', file);

        this.client.post(
            'http://localhost:9006/data/upload',
            formData
        ).subscribe(() => console.log("Файл загружен"));
    }

    getMeasurements(): Observable<Array<Measurement>> {
        return this.client.get<Measurement[]>(
            'http://localhost:9006/getComtrade'
        );
    }

    getSvg(path: string): Observable<string> {
        return this.client.get(
            path,
            {responseType: 'text'}
        );
    }
}

