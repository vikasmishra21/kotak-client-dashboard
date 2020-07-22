import {Component, AfterViewInit, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BasicUtil} from '../../../util/basicUtil';
import {ChartProviderConfiguration} from "../../../interfaces/chart-provider-configuration";
import {ChartProvider} from "../../../enums/chart.provider";
import {ECharts} from "./renderer/e.charts";
import {ZingChart} from "./renderer/zing.chart";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements AfterViewInit, OnInit, OnDestroy {

  constructor() {
  }

  @Input() chartProvider: ChartProvider;
  @Input() configSubject: Subject<ChartProviderConfiguration>;
  private unSubscribe = new Subject();
  chartId: string;
  @Output() nodeClicked: EventEmitter<any> = new EventEmitter();
  @Output() chartClicked: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit() {
    this.configSubject
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(config => {
        this.renderChart(config);
      });
  }

  renderChart(config: ChartProviderConfiguration) {
    switch (this.chartProvider) {
      case ChartProvider.ChartJS:
        break;
      case ChartProvider.ZingChart:
        ZingChart.render(this.chartId, config);
        ZingChart.bindChartClick(this.chartId, config, this.chartClicked);
        ZingChart.bindNodeClick(this.chartId, config, this.chartClicked);
        break;
      case ChartProvider.ECharts:
      default:
        ECharts.render(this.chartId, config);
        break;
    }
  }

  ngOnInit() {
    this.chartId = BasicUtil.newGuid();
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

}


