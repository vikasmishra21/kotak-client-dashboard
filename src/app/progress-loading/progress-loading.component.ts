import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-loading',
  templateUrl: './progress-loading.component.html',
  styleUrls: ['./progress-loading.component.sass']
})
export class ProgressLoadingComponent implements OnInit {

  private _show: boolean;
  get show(): boolean {
    return this._show;
  }
  @Input() set show(showloader: boolean) {
    this._show = showloader;
  }
  constructor() { }

  ngOnInit() {
  }

  getProgress()
  {
    var windowWidth = window.innerWidth;
    if(windowWidth > 1440){
    var left = (windowWidth -1440)/2;
    return left;
  }}

}
