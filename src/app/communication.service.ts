import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Measurement} from "./app.component";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private fileSub$ = new Subject<File>();
  file$ = this.fileSub$.asObservable();

  private measurementsSub$ = new Subject<Array<Measurement>>();
  measurements$ = this.measurementsSub$.asObservable();

  public addFile(file: File){
    this.fileSub$.next(file);
  }

  public addMeasurements(
    measurements: Measurement[]
  ){
    this.measurementsSub$.next(measurements);
  }
}
