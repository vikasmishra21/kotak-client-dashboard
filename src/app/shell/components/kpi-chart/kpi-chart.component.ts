import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ChartProviderConfiguration} from '../../interfaces/chart-provider-configuration';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-kpi-chart',
  templateUrl: './kpi-chart.component.html',
  styleUrls: ['./kpi-chart.component.css']
})
export class KpiChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() configSubject: Subject<ChartProviderConfiguration>;
  private unSubscribe = new Subject();
  score: number;
  difference: number;

  constructor() {
  }

  ngAfterViewInit() {
    this.configSubject
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(config => {
         this.score = config.Score;
         this.difference = Math.round(config.Diff);
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

}
