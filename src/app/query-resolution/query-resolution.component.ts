import { Component, OnInit } from '@angular/core';
import { FilterService } from '../shell/services/filter.service';
import { Subject, Subscription } from 'rxjs';
import { Chart } from '../shell/models/chart';
import { QueryTables } from './tables/query-tables';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

@Component({
  selector: 'app-query-resolution',
  templateUrl: './query-resolution.component.html',
  styleUrls: ['./query-resolution.component.sass']
})
export class QueryResolutionComponent implements OnInit {
  public tableNets = [
    { text: 'Mean', value: 'mean' },
    { text: 'Top 2', value: 'top2' },
    { text: 'Bot 2', value: 'bot2' },
    { text: 'Bot 6', value: 'bot6' }
  ];
  public onDataUpdate: Subject<any> = new Subject<any>();
  public onRegressionDataUpdate: Subject<any> = new Subject<any>();
  public selectedTableNet = 'top2';
  public driversByMachinesConfig: Chart;
  public queryResolutionConfig: Chart;
  public drivers = [
    { text: 'Installation', variableName: 'v26', value: 0, color: 'rgb(88, 103, 221)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-cogs', bgColor: 'rgba(88, 103, 221,.1)' },
    { text: 'Documentation', variableName: 'v34', value: 0, color: 'rgb(250, 40, 191)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-file', bgColor: 'rgba(250, 40, 191,.1)' },
    { text: 'Servicing', variableName: 'v36', value: 0, color: 'rgb(253,103,103)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-cog', bgColor: 'rgba(253,103,103,.1)' }
  ];
  public showLoader: boolean;
  public respondantBase: number;
  public noOfRespondant: Subscription;
  public showTableNets: boolean = true;

  constructor(private filterService: FilterService, private respondant: GenericRespondantShare) {
    this.noOfRespondant = this.respondant.getRespondant().subscribe(data => {
      this.respondantBase = data;
    });
  }

  ngOnInit() {
    this.showLoader = true;
    this.initializeTables(this.selectedTableNet);
    this.initializeChart();
    this.getContentHeight();

    this.filterService.optionSelectionCallback$.subscribe(value => {
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });

    // To bring data without a filter selected.
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  onTableNettingChange(changedSelectedTableNet) {
    this.selectedTableNet = changedSelectedTableNet;
    this.initializeTables(this.selectedTableNet);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  public initializeTables(selectedTableNet) {
    this.driversByMachinesConfig = QueryTables.getDriversByMachines(selectedTableNet);
    this.driversByMachinesConfig.addTableDataReady((output, dataTable, rawData) => {
      setTimeout(() => {
        this.showLoader = false;
      }, 3500);
      for (let i = 0, outputIndex = 0; i < this.drivers.length && outputIndex < output.length; i++, outputIndex += 4) {
        let score = output[outputIndex].Score as number | string === 'NaN' ? 0 : output[outputIndex].Score;
        this.drivers[i].value = score;

        score = output[outputIndex + 1].Score as number | string === 'NaN' ? 0 : output[outputIndex + 1].Score;
        this.drivers[i].one = score;

        score = output[outputIndex + 2].Score as number | string === 'NaN' ? 0 : output[outputIndex + 2].Score;
        this.drivers[i].two = score;

        score = output[outputIndex + 3].Score as number | string === 'NaN' ? 0 : output[outputIndex + 3].Score;
        this.drivers[i].moreThanTwo = score;
      }

      this.onRegressionDataUpdate.next();
    });
  }

  public initializeChart() {
    this.queryResolutionConfig = QueryTables.getQueryResolutionConfig(this.selectedTableNet);

    this.queryResolutionConfig.addChartConfigChange((output, config, rawData) => {
      setTimeout(() => {
        this.showLoader = false;
      }, 3500);
      config = {};

      config.height = '95%';
      config.width = '500px';
      config.grid = {
        height: '80%',
        width: '85%',
        top: 20,
        left: '10%'
      }
      config.yAxis = {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      };
      config.xAxis = {
        type: 'value',
        splitNumber: 10,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      };
      config.tooltip = {
        show: true
      };

      config.title = {
        text: this.selectedTableNet === 'top2' ? 'Top 2 (%)' : this.selectedTableNet === 'bot2' ? 'Bot 2 (%)' : this.selectedTableNet === 'bot6' ? 'Bot 6 (%)' : 'Mean',
        top: '94%',
        left: 'center',
        backgroundColor: 'rgba(0,55,114,0.1)',
        textStyle: { fontSize: 14, fontWeight: 'normal', color: '#003772' }
      }
      config.series = [
        {
          name: 'Regression',
          data: [],
          type: 'scatter',
          symbolSize: 40
        }
      ];

      rawData.RegressionResult.Summary.forEach((summary, index) => {
        if (summary.variableID === 'intercept') {
          return;
        }

        if (summary.P_value > 0.05) {
          return;
        }

        let driver = this.drivers.find(x => x.variableName === summary.variableID);

        config.series[0].data.push({
          name: driver.text,
          value: [driver.value, summary.Coefficients.toFixed(2)],
          itemStyle: {
            color: driver.color
          }
        });
      });

      return config;
    });
  }

  public getContentHeight() {
    return window.innerHeight - 170;
  }
}
