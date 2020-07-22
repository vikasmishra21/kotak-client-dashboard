import {ChartProviderConfiguration} from "../../../../interfaces/chart-provider-configuration";
import {Injectable} from "@angular/core";
declare var echarts: any;

@Injectable()
export class ECharts {

  static render(id: string, config: ChartProviderConfiguration) {
    // use configuration item and data specified to show chart
    const chartEle = document.getElementById(id);
    chartEle.style.height = config.height;
    chartEle.style.width = config.width;
    const chart = echarts.init(chartEle);
    chart.setOption(config);
  }
}
