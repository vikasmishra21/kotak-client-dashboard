import {Injectable} from '@angular/core';
import {ChartTypes} from '../enums/chart.types';
import {ChartProvider} from '../enums/chart.provider';
import {ChartProviderConfiguration} from '../interfaces/chart-provider-configuration';
import {ChartConfigurable} from '../interfaces/chart-configurable';
import {ZingChart} from './configurables/zing.chart';
import {ECharts} from './configurables/echarts';

@Injectable()
export class ChartConfiguration {

  static createChartConfig(type: ChartTypes, provider: ChartProvider,
                           data: Array<any>, title: string): ChartProviderConfiguration {

    const configurationProvider: ChartConfigurable = this.getConfigProvider(provider);
    let configuration;
    switch (type) {
      case ChartTypes.KPI:
        configuration = configurationProvider.forKPI(title, data);
        break;
      case ChartTypes.Ring:
        configuration = configurationProvider.forRing(title, data);
        break;
      case ChartTypes.BarChart:
        configuration = configurationProvider.forBar(title, data);
        break;
      case ChartTypes.HorizontalBar:
        configuration = configurationProvider.forHBar(title, data);
        break;
      case ChartTypes.Line:
        configuration = configurationProvider.forLine(title, data);
        break;
      case ChartTypes.Pie:
        configuration = configurationProvider.forPie(title, data);
        break;
      case ChartTypes.Scatter:
        configuration = configurationProvider.forScatter(title, data);
        break;
      case ChartTypes.StackedVerticalBar:
        configuration = configurationProvider.forStackedVerticalBar(title, data);
        break;
      case ChartTypes.StackedHorizontalBar:
        configuration = configurationProvider.forStackedHorizontalBar(title, data);
        break;
      case ChartTypes.MeanChart:
        configuration = configurationProvider.forMeanChart(title, data);
        break;
      case ChartTypes.VerticalBar:
        configuration = configurationProvider.forVBar(title, data);
        break;
      case ChartTypes.Area:
        configuration = configurationProvider.forArea(title, data);
        break;
      case ChartTypes.Bubble:
        configuration = configurationProvider.forBubble(title, data);
        break;
      case ChartTypes.Gauge:
        configuration = configurationProvider.forGauge(title, data);
        break;
      case ChartTypes.Radar:
        configuration = configurationProvider.forRadar(title, data);
        break;
    }
    return configuration;
  }

  private static getConfigProvider(provider: ChartProvider): ChartConfigurable {
    let configurationProvider: ChartConfigurable;
    switch (provider) {
      case ChartProvider.ZingChart:
        configurationProvider = new ZingChart();
        break;
      case ChartProvider.ECharts:
        configurationProvider = new ECharts();
        break;
      case ChartProvider.ChartJS:
        break;
    }
    return configurationProvider;
  }
}
