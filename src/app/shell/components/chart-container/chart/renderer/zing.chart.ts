import {ChartProviderConfiguration} from "../../../../interfaces/chart-provider-configuration";
import {EventEmitter, Injectable} from "@angular/core";

declare var zingchart: any;

@Injectable()
export class ZingChart {

  static render(id: string, config: ChartProviderConfiguration) {
    // use configuration item and data specified to show chart
    zingchart.render({
      id: id,
      data: config,
      height: config.height !== undefined ? config.height : 100,
      width: config.width !== undefined ? config.width : 200
    });
  }

  static bindNodeClick(id: string, config: ChartProviderConfiguration, emmiter: EventEmitter<any>) {
    zingchart.bind(id, 'node_click', (p: any) => {
      emmiter.emit({
        node: p,
        chartConfig: config
      });
    });
  }

  static bindChartClick(id: string, config: ChartProviderConfiguration, emmiter: EventEmitter<any>) {
    zingchart.bind(id, 'click', (p: any) => {
      emmiter.emit({
        node: p,
        chartConfig: config
      });
    });
  }
}
