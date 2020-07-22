import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { BreakType } from 'src/app/shell/operators/chart.operators';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class NPSOverview {
  constructor() { }

  public static getNPSChartConfig(): Chart {
    const config = new Chart({
      SideBreak: ['v5'],
      TopBreak: [],
      Type: ChartTypes.Gauge,
      Measure: Measure.ColumnPercent
    }, 'NPS Score', ChartProvider.ECharts);

    // config.setSideBreakFilter('v5', 'SurveyStatus', [2], FilterCondition.AnyItemSelected);
    // config.showSideBreakBase(0, true);
    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);

      let promoter = originalSeries.find(series => series.SeriesCode === '3') ? originalSeries.find(series => series.SeriesCode === '3').Score : 0;
      let detractor = originalSeries.find(series => series.SeriesCode === '1') ? originalSeries.find(series => series.SeriesCode === '1').Score : 0;

      if (originalSeries.length !== 0) {
        originalSeries[0].SeriesName = 'NPS';
        originalSeries[0].Score = promoter - detractor;
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '90%';
      config.width = '260px';

      config.grid = { height: '90%' };

      if (output.length !== 0) {
        let npsSeries = output.find(series => series.SeriesName === 'NPS');

        config.series = [
          {
            name: npsSeries.SeriesName,
            type: 'gauge',
            radius: '100%',
            min: -100,
            max: 100,
            splitNumber: 5,
            detail: { formatter: '{value}', fontSize: 14, offsetCenter: [0, '80%'],backgroundColor: '#f2f2f2',borderRadius: 2,padding: [10,15],fontWeight:'bold' },
            axisLabel: { fontSize: 10, fontFamily: 'Lato' },
            axisLine: { lineStyle: { color: [[0.5, '#dc3545'], [0.8, '#FFBF00'], [1, '#28a745']], width: 20 } },
            pointer: { width: '6', length: '60%' },
            data: [npsSeries.Score]
          }
        ];
      }

      return config;
    });

    return config;
  }

  public static getMainReasonChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v6'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'Main Reason', ChartProvider.ECharts);

    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score: 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '680px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '60%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/ /g, '\n');
        return value;
      }

      // config.series[0].tooltip = {
      //   show: false,
      // };
      config.tooltip = {
        position: 'inside'
      };
      config.xAxis.axisLabel.align = 'center';

      if (config.series.length > 1) {
        config.series = [config.series[1]];
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
          },
          fontFamily: 'Lato'
        },
      };
      if (isScaleTo100 === true) {
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }

      config.series.forEach((series, i) => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getNumberOfMachinesChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v66'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'Number Of Machines', ChartProvider.ECharts);

    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score : 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '250px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '15%', height: '60%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'center';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/ /g, '\n');
        return value;
      }
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
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }

      if (config.series.length > 1) {
        config.series = [config.series[1]];
      }

      config.series.forEach(series => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getNPSByRegionChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'NPS By Region', ChartProvider.ECharts);

    config.hideSideBreakOptions(0, [14]);

    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score : 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '650px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '65%', width: '90%' }
      config.xAxis.axisLabel.inside = false;
      config.xAxis.axisLabel.textStyle.color = 'black';
      config.xAxis.axisLabel.align = 'right';
      config.xAxis.axisLabel.fontSize = 10;
      config.xAxis.axisLabel.fontFamily = 'Lato';
      config.xAxis.axisLabel.interval = 0;
      // config.xAxis.axisLabel.rotate = 90;
      config.xAxis.axisLabel.formatter = (value, index) => {
        value = value.trim().replace(/[ ,\/]/g, '\n');
        return value;
      }
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
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }
      // config.xAxis.axisLabel.rotate = -20;
      config.xAxis.axisLabel.align = 'center';

      if (config.series.length > 1) {
        config.series = [config.series[1]];
      }

      config.series.forEach(series => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getStoreTypeChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v65'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'Type Of Store', ChartProvider.ECharts);

    // config.hideSideBreakOptions(0, [2,3,5, 8,12,15]);
    config.hideSideBreakOptions(0, [19, 21]);
    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score : 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
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
      config.xAxis.axisLabel.rotate = 10;
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
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }

      // config.xAxis.axisLabel.rotate = -7;
      config.xAxis.axisLabel.align = 'center';

      if (config.series.length > 1) {
        config.series = [config.series[1]];
      }

      config.series.forEach(series => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getWordlineChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v30'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'Wordline', ChartProvider.ECharts);

    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score : 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '450px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '8%', height: '60%', width: '90%' }
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
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }
      // config.xAxis.axisLabel.rotate = -15;
      config.xAxis.axisLabel.align = 'center';

      if (config.series.length > 1) {
        config.series = [config.series[1]];
      }

      config.series.forEach(series => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getNPSByTimesVisitedChart(isScaleTo100, isLabelsShow): Chart {
    const config = new Chart({
      SideBreak: ['v33'],
      TopBreak: ['v5'],
      Type: ChartTypes.BarChart,
      Measure: Measure.RowPercent
    }, 'NPS By Times Visited', ChartProvider.ECharts);

    config.addCalculationLogic(output => {
      let originalSeries = output.TableOutput.get(config.Name);
      let seriesMap = {};

      for (let i = 0; i < originalSeries.length; i++) {
        if (!seriesMap[originalSeries[i].SeriesName]) {
          seriesMap[originalSeries[i].SeriesName] = {};
        }

        seriesMap[originalSeries[i].SeriesName][originalSeries[i].CategoryCode] = originalSeries[i];
      }

      originalSeries.length = 0;

      for (let region in seriesMap) {
        let promoterScore = seriesMap[region][3] ? seriesMap[region][3].Score : 0;
        let detractorScore = seriesMap[region][1] ? seriesMap[region][1].Score : 0;

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        let npsScore = promoterScore - detractorScore;

        seriesMap[region][1].Score = npsScore;
        originalSeries.push(seriesMap[region][1]);
      }

      return output;
    });

    config.addChartConfigChange((output, config) => {
      config.height = '100%';
      config.width = '450px';

      config.title = { show: false };
      config.legend = { show: true };
      config.dataZoom = [{ type: 'inside', disabled: true }];
      config.grid = { top: 20, left: '7%', height: '60%', width: '90%' }
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
        config.yAxis.max = undefined;
        config.yAxis.min = undefined;
      } else {
        config.yAxis.max = 100;
        config.yAxis.min = -100;
      }

      // config.xAxis.axisLabel.rotate = -15;
      config.xAxis.axisLabel.align = 'center';

      if (config.series.length > 1) {
        config.series = [config.series[1]];
      }

      config.series.forEach(series => {
        if (isLabelsShow === true) {
          series.label = { show: true, position: 'top' };
        } else {
          series.label = { show: false };
        }
        series.data.forEach((data, index, array) => {
          let score = data;
          let color;

          if (data <= 0) {
            color = '#dc3545';
          } else if (data > 0 && data <= 60) {
            color = '#FFBF00';
          } else {
            color = '#28a745';
          }

          array[index] = {
            value: data,
            itemStyle: { color }
          }
        });
      });

      return config;
    });

    return config;
  }

  public static getTopBottomLocationTable(): Chart {
    const config = new Chart({
      SideBreak: ['v57'],
      TopBreak: ['v5'],
      Type: ChartTypes.Table,
      Measure: Measure.RowPercent
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
      Measure: Measure.RowPercent
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
