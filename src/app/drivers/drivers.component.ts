import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '../shell/models/chart';
import { DriverTables } from './tables/driver-tables';
import { FilterService } from '../shell/services/filter.service';
import { Subject, Subscription } from 'rxjs';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.sass']
})
export class DriversComponent implements OnInit {
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
  public driverAnalysisConfig: Chart;
  public drivers = [
    { text: 'Installation', variableName: 'v22', value: 0, color: 'rgb(88, 103, 221)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-cog', bgColor: 'rgba(88, 103, 221,.1)' },
    { text: 'Explanation', variableName: 'v24', value: 0, color: 'rgb(255, 184, 34)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-info-circle', bgColor: 'rgba(255, 184, 34,.1)' },
    { text: 'Ease of Documentation', variableName: 'v38', value: 0, color: 'rgb(250, 40, 191)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-file-alt', bgColor: 'rgba(250, 40, 191,.1)' },
    { text: 'Resolution', variableName: 'v44', value: 0, color: 'rgb(23, 165, 20)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-user-cog', bgColor: 'rgba(23, 165, 20,.1)' },
    { text: 'Response at Call Center', variableName: 'v42', value: 0, color: '#0095d9', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-reply-all', bgColor: 'rgba(0, 149, 217,.1)' },
    { text: 'Pricing and Charges', variableName: 'v40', value: 0, color: 'rgb(186, 33, 143)', one: 0, two: 0, moreThanTwo: 0, icon: 'fa-dollar-sign', bgColor: 'rgba(186, 33, 143,.1)' },
  ];
  public showLoader: boolean;
  public noOfRespondant: Subscription;
  public respondantBase: number;
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
    // this.filterService.setChoices('v5', []);
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
    this.showLoader = true;
    this.driversByMachinesConfig = DriverTables.getDriversByMachines(selectedTableNet);
    this.driversByMachinesConfig.addTableDataReady((output, dataTable, rawData) => {
      setTimeout(() => {
        this.showLoader = false;
      }, 2000);
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
    this.driverAnalysisConfig = DriverTables.getDriverRegressionConfig(this.selectedTableNet);

    this.driverAnalysisConfig.addChartConfigChange((output, config, rawData) => {
      setTimeout(() => {
        this.showLoader = false;
      }, 3000);
      config = {};

      config.height = '95%';
      config.width = '500px';
      config.grid = {
        height: '75%',
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
        top: '90%',
        left: 'center',
        backgroundColor: '#f2f2f2',
        padding: [10, 15],
        textStyle: { fontSize: 14, fontWeight: 'bold', color: '#003772', width: '30px', height: '30px' }
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
    return window.innerHeight - 160;
  }
}
