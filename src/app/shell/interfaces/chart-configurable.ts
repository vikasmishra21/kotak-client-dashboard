import {ChartProviderConfiguration} from './chart-provider-configuration';

export interface ChartConfigurable {
  forLine(title: string, data: Array<any>): ChartProviderConfiguration;

  forRing(title: string, data: Array<any>): ChartProviderConfiguration;

  forPie(title: string, data: Array<any>): ChartProviderConfiguration;

  forKPI(title: string, data: Array<any>): ChartProviderConfiguration;

  forHBar(title: string, data: Array<any>): ChartProviderConfiguration;

  forVBar(title: string, data: Array<any>): ChartProviderConfiguration;

  forBar(title: string, data: Array<any>): ChartProviderConfiguration;

  forStackedHorizontalBar(title: string, data: Array<any>): ChartProviderConfiguration;

  forStackedVerticalBar(title: string, data: Array<any>): ChartProviderConfiguration;

  forMeanChart(title: string, data: Array<any>): ChartProviderConfiguration;

  forScatter(title: string, data: Array<any>): ChartProviderConfiguration;

  forArea(title: string, data: Array<any>): ChartProviderConfiguration;

  forBubble(title: string, data: Array<any>): ChartProviderConfiguration;

  forGauge(title: string, data: Array<any>): ChartProviderConfiguration;
  
  forRadar(title: string, data: Array<any>): ChartProviderConfiguration;
}
