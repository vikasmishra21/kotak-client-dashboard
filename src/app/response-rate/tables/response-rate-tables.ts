import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';
import { BreakType } from 'src/app/shell/operators/chart.operators';

export class ResponseRateTables {
  constructor() { }

  public static getResponseRateConfig(): Chart {
    const config = new Chart({
      SideBreak: ['SurveyStatus'],
      TopBreak: [],
      ExcludeFilters: ['SurveyStatus'],
      Type: ChartTypes.Gauge,
      Measure: Measure.Count
    }, 'Response Rate', ChartProvider.ECharts);

    config.addShowAllSeries(true);

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '350px';

      config.grid = { height: '100%', width: '100%' };

      let totalSent = 0;
      output.forEach(x => totalSent += x.Score);

      let scoreFraction = (config.series[0].data[1].value / totalSent) * 100;
      scoreFraction = parseFloat(scoreFraction.toFixed(2));

      config.series[0].name = '';
      config.series[0].type = 'gauge';
      config.series[0].radius = '100%';
      config.series[0].min = 0;
      config.series[0].max = 100;
      config.series[0].splitNumber = 5;
      config.series[0].center = ['50%', '70%'];
      config.series[0].pointer = { show: false };
      config.series[0].detail = { formatter: '{value}%', fontSize: 14, offsetCenter: [0, '40%'], backgroundColor: '#f2f2f2', borderRadius: 2, padding: [10, 15], fontWeight: 'bold' };
      config.series[0].axisLine = { lineStyle: { color: [[0.01 * scoreFraction, '#003772'], [0.9 * scoreFraction, '#D3D3D3'], [1 * scoreFraction, '#D3D3D3']] } };
      config.series[0].axisTick = { show: false };
      config.series[0].splitLine = { show: false };

      config.series[0].data = [scoreFraction];

      return config;
    });

    return config;
  }

  public static getLocationChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v52'],
      TopBreak: ['SurveyStatus'],
      ExcludeFilters: ['SurveyStatus'],
      Type: ChartTypes.BarChart,
      Measure: Measure.Count
    }, 'Location', ChartProvider.ECharts);

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '1300px';
      output.sort((a, b) => b.Score - a.Score);

      const seriesRate = this.createResponseRate(output);

      config.series = [{
        type: 'bar',
        itemStyle: { normal: { color: "rgba(0,55,114,1)" } },
        data: []
      }];
      config.xAxis.data = [];

      seriesRate.seriesCodes.sort((a, b) => {
        return seriesRate.seriesMap[b].rate - seriesRate.seriesMap[a].rate;
      })

      seriesRate.seriesCodes.forEach(seriesCode => {
        if (seriesRate.seriesMap[seriesCode].rate <= 0) {
          return;
        }

        config.xAxis.data.push(seriesRate.seriesMap[seriesCode].text);
        config.series[0].data.push(seriesRate.seriesMap[seriesCode].rate);
      });

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '4%', height: '45%', width: '95%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.formatter = (value, index) => {
        if (value.length > 14) {
          value = value.substring(0, 11) + '...';
        }

        return value;
      };
      // config.xAxis.axisLabel.margin = 10;
      config.xAxis.axisLabel.rotate = 90;
      config.xAxis.axisLabel.align = 'right';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
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
      if (isLabelsShow === true) {
        config.series[0].label = { show: true, position: 'top' };
      } else {
        config.series[0].label = { show: false, position: 'inside' };
      }
      // config.series[1].data = [];
      // config.xAxis.data = [];
      // output.forEach(val => {
      //   if (val.Score !== 0) {
      //     config.series[1].data.push(val.Score);
      //     config.xAxis.data.push(val.SeriesName);
      //   }
      // });

      return config;
    });

    return config;
  }

  public static getNumberOfMachinesChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v66'],
      TopBreak: ['SurveyStatus'],
      ExcludeFilters: ['SurveyStatus'],
      Type: ChartTypes.BarChart,
      Measure: Measure.Count
    }, 'Number Of Machines', ChartProvider.ECharts);

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '260px';

      const seriesRate = this.createResponseRate(output);

      config.series = [{
        type: 'bar',
        itemStyle: { normal: { color: "rgba(0,55,114,1)" } },
        data: []
      }];
      config.xAxis.data = [];

      seriesRate.seriesCodes.forEach(seriesCode => {
        config.xAxis.data.push(seriesRate.seriesMap[seriesCode].text);
        config.series[0].data.push(seriesRate.seriesMap[seriesCode].rate.toFixed(2));
      });

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '12%', height: '70%', width: '80%' }
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
        show: true,
      };
      if (isLabelsShow === true) {
        config.series[0].label = { show: true, position: 'top' };
      } else {
        config.series[0].label = { show: false, position: 'top' };
      }
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

  public static getRegionChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: ['SurveyStatus'],
      ExcludeFilters: ['SurveyStatus'],
      Type: ChartTypes.BarChart,
      Measure: Measure.Count
    }, 'Driver By Region', ChartProvider.ECharts);

    config.hideSideBreakOptions(0, [14])
    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '980px';

      const seriesRate = this.createResponseRate(output);

      config.series = [{
        type: 'bar',
        itemStyle: { normal: { color: "rgba(0,55,114,1)" } },
        data: []
      }];
      config.xAxis.data = [];

      seriesRate.seriesCodes.forEach(seriesCode => {
        config.xAxis.data.push(seriesRate.seriesMap[seriesCode].text);
        config.series[0].data.push(seriesRate.seriesMap[seriesCode].rate.toFixed(2));
      });

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '65%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      // config.xAxis.axisLabel.rotate = 90;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/[ ,\/]/g, '\n');
        return value;
      };
      config.tooltip = {
        position: 'inside'
      };
      config.series[0].tooltip = {
        show: true,
      };
      if (isLabelsShow === true) {
        config.series[0].label = { show: true, position: 'top' };
      } else {
        config.series[0].label = { show: false, position: 'top' };
      }
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

  public static getStoreTypeChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v65'],
      TopBreak: ['SurveyStatus'],
      ExcludeFilters: ['SurveyStatus'],
      Type: ChartTypes.BarChart,
      Measure: Measure.Count
    }, 'Type Of Store', ChartProvider.ECharts);

    config.hideSideBreakOptions(0, [22]);
    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '980px';

      const seriesRate = this.createResponseRate(output);

      config.series = [{
        type: 'bar',
        itemStyle: { normal: { color: "rgba(0,55,114,1)" } },
        data: []
      }];
      config.xAxis.data = [];

      seriesRate.seriesCodes.forEach(seriesCode => {
        config.xAxis.data.push(seriesRate.seriesMap[seriesCode].text);
        config.series[0].data.push(seriesRate.seriesMap[seriesCode].rate.toFixed(2));
      });

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '50%', width: '90%' }
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
        show: true,
      };
      if (isLabelsShow === true) {
        config.series[0].label = { show: true, position: 'top' };
      } else {
        config.series[0].label = { show: false, position: 'top' };
      }
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

  private static createResponseRate(output) {
    let seriesCodes = [];
    let seriesMap = {};

    output.forEach(series => {
      if (!seriesMap[series.SeriesCode]) {
        seriesCodes.push(series.SeriesCode);
        seriesMap[series.SeriesCode] = { text: series.SeriesName, total: 0, complete: 0 };
      }

      seriesMap[series.SeriesCode].total += series.Score;
      if (series.CategoryCode === '2') {
        seriesMap[series.SeriesCode].complete = series.Score;
      }
    });

    for (let seriesCode in seriesMap) {
      seriesMap[seriesCode].rate = (seriesMap[seriesCode].complete / seriesMap[seriesCode].total) * 100;
    }

    return { seriesCodes, seriesMap };
  }

  public static getTopBottomLocationTable(): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: ['v5'],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'NPS By Locations', ChartProvider.ECharts);

    config
      .for(BreakType.SideBreak)
      .nest(0, ['v52']);

    config.addShowAllSeries(true);

    return config;
  }

  public static getTopBottomPSMTable(): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: ['v5'],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'NPS By PSM', ChartProvider.ECharts);

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
