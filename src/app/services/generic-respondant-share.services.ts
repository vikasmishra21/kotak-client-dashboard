import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class GenericRespondantShare {

  private noOfRespondant: Subject<any> = new Subject<any>();
  private scalintTo100:  Subject<any> = new Subject<any>();
  private showLables:  Subject<any> = new Subject<any>();
  constructor() {

  }

  // for base (respondent) share
  sendRespondant(base: number) {
    this.noOfRespondant.next(base);
  }
  getRespondant() {
    return this.noOfRespondant.asObservable();
  }

  // for scaling the charts axis
  sendScaleFlag(scale: boolean) {
    this.scalintTo100.next(scale);
  }
  getScaleFlag() {
    return this.scalintTo100.asObservable();
  }

  // for labels show on charts top
  sendLabelsFlag(label: boolean) {
    this.showLables.next(label);
  }
  getLabelsFlag() {
    return this.showLables.asObservable();
  }
}
