import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';
import { BreakType } from 'src/app/shell/operators/chart.operators';

export class IndividualDriverTables {
  constructor() { }

  private static setFilterOnConfig(config: Chart, filterVariable, selectedNet): void {
    let filterOptions = [];

    switch (selectedNet) {
      case 'top2':
        filterOptions = [9, 10];
        break;

      case 'bot2':
        filterOptions = [0, 1];
        break;

      case 'bot6':
        filterOptions = [0, 1, 2, 3, 4, 5];
        break;

      default:
        filterOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    config.addCollectionFilter(filterVariable, filterOptions, FilterCondition.AnyItemSelected);
  }

  private static setNettingOnConfig(config: Chart, selectedNet): void {
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
  }

  public static getDriverConfig(driverVariable, selectedNet, color): Chart {
    const config = new Chart({
      SideBreak: [driverVariable],
      TopBreak: [],
      Type: ChartTypes.Gauge,
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent
    }, 'NPS Score', ChartProvider.ECharts);

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

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '320px';

      config.grid = { height: '100%', width: '100%' };

      let scoreFraction = config.series[0].data[0].value;
      if (selectedNet === 'mean') {
        scoreFraction /= 10
      } else {
        scoreFraction /= 100;
      }

      config.series[0].name = '';
      config.series[0].type = 'gauge';
      config.series[0].radius = '100%';
      config.series[0].min = 0;
      config.series[0].max = selectedNet === 'mean' ? 10 : 100;
      config.series[0].splitNumber = 5;
      config.series[0].center = ['50%', '70%'];
      config.series[0].pointer = { show: false };
      config.series[0].axisLine = { lineStyle: { color: [[scoreFraction, color], [1, '#e9e9e9']] } };
      config.series[0].axisTick = { show: false };
      config.series[0].splitLine = { show: false };

      if (selectedNet === 'mean') {
      config.series[0].detail = { formatter: '{value}', fontSize: 14, offsetCenter: [0, '40%'],backgroundColor: '#f2f2f2',borderRadius: 2,padding: [10,15],fontWeight:'bold' };
      } else {
      config.series[0].detail = { formatter: '{value}%', fontSize: 14, offsetCenter: [0, '40%'],backgroundColor: '#f2f2f2',borderRadius: 2,padding: [10,15],fontWeight:'bold' };
      }

      config.series[0].data.forEach(point => point.name = '');

      return config;
    });

    return config;
  }

  public static getNumberOfMachinesChart(driverVariable, selectedNet, color, isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: [driverVariable],
      TopBreak: ['v66'],
      Type: ChartTypes.BarChart,
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent
    }, 'Number Of Machines', ChartProvider.ECharts);

    this.setNettingOnConfig(config, selectedNet);

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '660px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '70%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
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
      config.series[1].itemStyle.normal.color = color;
      if (isLabelsShow === true) {
        config.series[1].label = { show: true, position: 'top' };
      } else {
        config.series[1].label = { show: false, position: 'top' };
      }
      config.xAxis.data.forEach((x, i, a) => {
        a[i] = output[i].CategoryName;
      });
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
        config.yAxis.min = 0;
      } else {
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      }

      return config;
    });

    return config;
  }

  public static getDriverByRegionChart(driverVariable, selectedNet, color, isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: [driverVariable],
      TopBreak: ['v57'],
      Type: ChartTypes.BarChart,
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent
    }, 'Driver By Region', ChartProvider.ECharts);

    this.setNettingOnConfig(config, selectedNet);
    config.hideTopBreakOptions(0, [14]);

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '1000px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '5%', height: '80%', width: '92%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/[ ,\/]/g, '\n');
        return value;
      };
      config.tooltip = {
        position: 'inside'
      };
      config.series[0].tooltip = {
        show: false,
      };
      config.series[1].itemStyle.normal.color = color;
      if (isLabelsShow === true) {
        config.series[1].label = { show: true, position: 'top' };
      } else {
        config.series[1].label = { show: false, position: 'top' };
      }
      config.xAxis.data.forEach((x, i, a) => {
        a[i] = output[i].CategoryName;
      });
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
        config.yAxis.min = 0;
      } else {
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      }

      return config;
    });

    return config;
  }

  public static getStoreTypeChart(driverVariable, selectedNet, color, isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: [driverVariable],
      TopBreak: ['v65'],
      Type: ChartTypes.BarChart,
      Measure: selectedNet === 'mean' ? Measure.Mean : Measure.ColumnPercent
    }, 'Type Of Store', ChartProvider.ECharts);

    this.setNettingOnConfig(config, selectedNet);

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '1000px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '5%', height: '70%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'right';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      config.xAxis.axisLabel.rotate = 90;
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
      config.series[1].itemStyle.normal.color = color;
      if (isLabelsShow === true) {
        config.series[1].label = { show: true, position: 'top' };
      } else {
        config.series[1].label = { show: false, position: 'top' };
      }
      config.xAxis.data.forEach((x, i, a) => {
        a[i] = output[i].CategoryName;
      });
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
        config.yAxis.min = 0;
      } else {
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      }

      return config;
    });

    return config;
  }

  public static getTopBottomLocationTable(driverVariable, selectedNet): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: [driverVariable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'NPS By Locations', ChartProvider.ECharts);

    config.TopBreak.forEach((variable, index) => {
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

      config.combineTopBreakOptions(variable, optionsToCombine, combinedText);
      config.showTopBreakOptions(index, [100001]);
    });

    config
      .for(BreakType.SideBreak)
      .nest(0, ['v52']);

    // config.addShowAllSeries(true);

    return config;
  }

  public static getTopBottomPSMTable(driverVariable, selectedNet): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: [driverVariable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'NPS By PSM', ChartProvider.ECharts);

    config.TopBreak.forEach((variable, index) => {
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

      config.combineTopBreakOptions(variable, optionsToCombine, combinedText);
      config.showTopBreakOptions(index, [100001]);
    });

    config
      .for(BreakType.SideBreak)
      .nest(0, ['v52']);

    let nestable = config
      .for(BreakType.SideBreak);

    nestable.parenNestKey = '0';
    nestable.nest(0, ['v56']);

    // config.addShowAllSeries(true);

    return config;
  }
}
