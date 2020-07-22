import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { BreakType } from 'src/app/shell/operators/chart.operators';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class SurveyStatusConfig {
    constructor() { }

    public static getNPSChartConfig(): Chart {
      const config = new Chart({
          SideBreak: ['SurveyStatus'],
          TopBreak: [],
          Type: ChartTypes.Table,
          Measure: Measure.ColumnPercent
      }, 'Survey Status', ChartProvider.ECharts);

      config.showSideBreakOptions(0, [2]);
      config.showSideBreakBase(0, true);

      return config;
  }

}
