import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.sass']
})
export class ContentHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() bases: number;
  @Input() selectedTableNet: any;
  @Input() tableNets: any;
  @Output() onSelection: EventEmitter<any> = new EventEmitter();
  @Input() showTableNets: boolean;
  public headerName: string;
  public isScaleTo100: any;
  public showLabels: any;

  constructor(private scaleFlag: GenericRespondantShare, private router: Router) {
    this.isScaleTo100 = new FormControl();
    this.showLabels = new FormControl();
  }

  ngOnInit() {
    this.setHeaderName(this.router.url);
  }

  onChangeScale() {
    this.scaleFlag.sendScaleFlag(this.isScaleTo100.value);
  }

  onChangeLabels() {
    this.scaleFlag.sendLabelsFlag(this.showLabels.value);
  }

  setHeaderName(route: string) {
    switch (route.split('/')[2]) {
      case 'hot-alerts':
        this.headerName = 'HOT ALERTS';
        break;
      case 'overall-drivers':
        this.headerName = 'OVERALL DRIVERS';
        break;
      case 'queryResolution':
        this.headerName = 'QUERY RESOLUTION';
        break;
        case 'npsoverview':
        this.headerName = 'NPS OVERVIEW';
        break;
    }
  }
}
