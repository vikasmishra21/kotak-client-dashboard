import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { AnalysisType } from 'src/app/shell/enums/analysis-type';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';
import { BreakType } from 'src/app/shell/operators/chart.operators';

export class CommentsTable {
  constructor() { }

  private static setFilterOnConfig(config: Chart, filterVariable, selectedNet): void {
    let filterOptions = [];

    switch (selectedNet) {
      case 'positive':
        filterOptions = [1];
        break;

      case 'negative':
        filterOptions = [2];
        break;

      default:
        return;
    }

    config.addCollectionFilter(filterVariable, filterOptions, FilterCondition.AnyItemSelected);
  }

  public static getCommentsTableConfig(selectedNet, page): Chart {
    const config = new Chart({
      SideBreak: ['v83', 'v6', 'v81', 'v5'],
      TopBreak: [],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Profile
    }, 'Comments', ChartProvider.ECharts);

    this.setFilterOnConfig(config, 'v82', selectedNet);
    config.addDataPagination(20, page);

    config.addCollectionFilter('v81', [25], FilterCondition.ItemNotSelected);
    config.addCollectionFilter('v81', [26], FilterCondition.ItemNotSelected);

    return config;
  }

  public static getCategoryConfig(selectedNet, isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v84'],
      TopBreak: [],
      Measure: Measure.Count,
      Type: ChartTypes.BarChart
    }, 'Categories', ChartProvider.ECharts);

    config.hideSideBreakOptions(0, [25, 26]);
    this.setFilterOnConfig(config, 'v82', selectedNet);

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '1300px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '6%', height: '70%', width: '90%' };
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      // config.xAxis.axisLabel.rotate = 90;
      config.xAxis.axisLabel.interval = 0;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/ /g, '\n');
        return value;
      };
      config.tooltip = {
        position: 'inside'
      };
      config.series[0].tooltip = {
        show: false,
      };
      config.yAxis = {
        splitLine: { show: false },
        axisLine: {
          show: true,
          lineStyle: { color: '#D7D7D7' }
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        },
      };
      if (isScaleTo100 === true) {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      } else {
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      }

      if (isLabelsShow === true) {
        config.series[1].label = { show: true, position: 'top' };
      } else {
        config.series[1].label = { show: false, position: 'top' };
      }

      return config;
    });

    return config;
  }

  public static getCommentsBubbleConfig(selectedNet): Chart {
    const config = new Chart({
      SideBreak: ['v4'],
      IndependentVariables: ['v84'],
      TopBreak: [],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Bubble,
      AnalysisType: AnalysisType.Regression,
      RegressionType: 2,
      UseCache: false,
      IsContinousVariable: false
    }, 'Categories Comments Reg.', ChartProvider.ECharts);

    // if (selectedNet === 'positive') {
    //   config.setSideBreakFilter('v4', 'v82', [1], FilterCondition.AnyItemSelected);
    // } else {
    //   config.setSideBreakFilter('v4', 'v82', [2], FilterCondition.AnyItemSelected);
    // }
    this.setFilterOnConfig(config, 'v82', selectedNet);
    // config.addCollectionFilter('v84', [], FilterCondition.WasAnswered);

    return config;
  }

  public static getRcommendationConfig(selectedTab): Chart {
    const config = new Chart({
      SideBreak: ['v84'],
      TopBreak: ['v4'],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'Recommendation', ChartProvider.ECharts);

    if (selectedTab === 'positive') {
      config.combineTopBreakOptions('v4', [9, 10], 'top2');
    } else {
      config.combineTopBreakOptions('v4', [0, 1, 2, 3, 4, 5, 6], 'bot6');
    }

    config.showTopBreakOptions(0, [100001]);
    this.setFilterOnConfig(config, 'v82', selectedTab);

    return config;
  }
}
