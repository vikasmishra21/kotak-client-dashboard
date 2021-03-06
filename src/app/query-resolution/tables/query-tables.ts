import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { AnalysisType } from 'src/app/shell/enums/analysis-type';

export class QueryTables {
  constructor() { }

  public static getDriversByMachines(selectedNet): Chart {
    const config = new Chart({
      SideBreak: ['v26', 'v34', 'v36'],
      TopBreak: ['v66'],
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'DriversByMachines', ChartProvider.ECharts);

    config.showTopBreakTotal(0, true);

    config.SideBreak.forEach((variable, index) => {
      let optionsToCombine = [];
      let combinedText;

      switch (selectedNet) {
        case 'top2':
          optionsToCombine = [9, 10];
          combinedText = 'Top 2';
          break;

        case 'bot2':
          optionsToCombine = [0, 1];
          combinedText = 'Bot 2';
          break;

        case 'bot6':
          optionsToCombine = [0, 1, 2, 3, 4, 5];
          combinedText = 'Bot 6';
          break;

        default:
          return;
      }

      config.combineSideBreakOptions(variable, optionsToCombine, combinedText);
      config.showSideBreakOptions(index, [100001]);
    });

    return config;
  }

  public static getQueryResolutionConfig(selectedNet): Chart {
    const config = new Chart({
      SideBreak: ['v4'],
      IndependentVariables: ['v26', 'v34', 'v36'],
      TopBreak: [],
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent,
      Type: ChartTypes.Bubble,
      AnalysisType: AnalysisType.Regression,
      RegressionType: 2,
      UseCache: false
    }, 'QueryResolution', ChartProvider.ECharts);

    return config;
  }
}
