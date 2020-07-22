import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Chart } from '../shell/models/chart';
import { ResponseRateTables } from './tables/response-rate-tables';
import { FilterService } from '../shell/services/filter.service';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';

@Component({
  selector: 'app-response-rate',
  templateUrl: './response-rate.component.html',
  styleUrls: ['./response-rate.component.sass']
})
export class ResponseRateComponent implements OnInit {
  public onDataUpdate: Subject<any> = new Subject<any>();
  public responseRateConfig: Chart;
  public locationConfig: Chart;
  public numberOfMachinesConfig: Chart;
  public regionConfig: Chart;
  public storeTypeConfig: Chart;

  public locationByNPSTableConfig: Chart;
  public locationByNPSTable: any[][] = [];
  public top5LocationsByNPS: any[][];
  public bottom5LocationByNPS: any[][];
  public psmByNPSTableConfig: Chart;
  public psmByNPSTable: any[][];
  public top5PSMByNPS: any[][];
  public bottom5PSMByNPS: any[][];
  public showLoader: boolean;
  public respondantBase: number;
  public noOfRespondant: Subscription;
  public scaling: Subscription;
  public isScaleTo100: boolean = false;
  public labelsShow: Subscription;
  public isLabelsShow: boolean = false;
  public onChangeScale: boolean = false;

  constructor(private filterService: FilterService, private respondant: GenericRespondantShare) {
    this.noOfRespondant = this.respondant.getRespondant().subscribe(data => {
      this.respondantBase = data;
    });
    this.scaling = this.respondant.getScaleFlag().subscribe(data => {
      this.onChangeScale = false;
      this.isScaleTo100 = data;
      this.initializeCharts();
      setTimeout(() => {
        this.showLoader = true;
      }, 2000);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
    this.labelsShow = this.respondant.getLabelsFlag().subscribe(data => {
      this.onChangeScale = false;
      this.isLabelsShow = data;
      this.initializeCharts();
      setTimeout(() => {
        this.showLoader = true;
      }, 2000);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
  }

  ngOnInit() {
    this.showLoader = true;
    this.initializeCharts();
    // this.initializeTables();

    this.filterService.optionSelectionCallback$.subscribe(value => {
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });

      setTimeout(() => {
        this.showLoader = false;
      }, 2500);
    });

    // To bring data without a filter selected.
    // this.filterService.setChoices('v5', []);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  public initializeCharts() {
    this.showLoader = true;
    this.responseRateConfig = ResponseRateTables.getResponseRateConfig();
    this.locationConfig = ResponseRateTables.getLocationChart(this.isScaleTo100, this.isLabelsShow);
    this.numberOfMachinesConfig = ResponseRateTables.getNumberOfMachinesChart(this.isScaleTo100, this.isLabelsShow);
    this.regionConfig = ResponseRateTables.getRegionChart(this.isScaleTo100, this.isLabelsShow);
    this.storeTypeConfig = ResponseRateTables.getStoreTypeChart(this.isScaleTo100, this.isLabelsShow);
    this.onChangeScale = true;
    setTimeout(() => {
      this.showLoader = false;
    }, 2500);
  }

  private initializeTables() {
    this.showLoader = true;
    this.locationByNPSTableConfig = ResponseRateTables.getTopBottomLocationTable();
    this.locationByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
      this.showLoader = false;

      this.locationByNPSTable = [];
      this.populateLocationByNPS(rawData.series);

      for (let i = 0; i < this.locationByNPSTable.length; i++) {
        let rowIndex = this.locationByNPSTable[i][2];
        let promoterScore = rawData.data[rowIndex][2];
        let detractorScore = rawData.data[rowIndex][0];

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        this.locationByNPSTable[i][2] = (promoterScore - detractorScore).toFixed(0);
      }

      this.locationByNPSTable.sort((a, b) => {
        return parseInt(b[2]) - parseInt(a[2]);
      });

      this.top5LocationsByNPS = [];
      this.bottom5LocationByNPS = [];

      for (let i = 0; i < 5; i++) {
        this.top5LocationsByNPS.push(this.locationByNPSTable[i]);
      }

      for (let i = (this.locationByNPSTable.length - 1); i >= (this.locationByNPSTable.length - 5); i--) {
        this.bottom5LocationByNPS.push(this.locationByNPSTable[i]);
      }
    });

    this.psmByNPSTableConfig = ResponseRateTables.getTopBottomPSMTable();
    this.psmByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
      this.showLoader = false;

      this.psmByNPSTable = [];
      this.populatePSMByNPS(rawData.series, null);

      for (let i = 0; i < this.psmByNPSTable.length; i++) {
        let rowIndex = this.psmByNPSTable[i][3];
        let promoterScore = rawData.data[rowIndex][2];
        let detractorScore = rawData.data[rowIndex][0];

        promoterScore = promoterScore === 'NaN' ? 0 : promoterScore;
        detractorScore = detractorScore === 'NaN' ? 0 : detractorScore;

        this.psmByNPSTable[i][3] = (promoterScore - detractorScore).toFixed(0);
      }

      this.psmByNPSTable.sort((a, b) => {
        return parseInt(b[3]) - parseInt(a[3]);
      });

      this.top5PSMByNPS = [];
      this.bottom5PSMByNPS = [];

      for (let i = 0; i < 5; i++) {
        this.top5PSMByNPS.push(this.psmByNPSTable[i]);
      }

      for (let i = (this.psmByNPSTable.length - 1); i >= (this.psmByNPSTable.length - 5); i--) {
        this.bottom5PSMByNPS.push(this.psmByNPSTable[i]);
      }
    });
  }

  private populateLocationByNPS(series, parentRow: any[] | void): void {
    let currentRow = parentRow;

    for (let i = 0; i < series.length; i++) {
      if (series[i].Header === 2 && series[i].SubSeries.length > 0) {
        currentRow = [];
        currentRow.push(series[i].Text);
      } else if (series[i].SubSeries.length === 0) {
        let leafRow = (parentRow as any[]).concat([]);

        leafRow.push(series[i].Text);
        leafRow.push(series[i].Index);

        this.locationByNPSTable.push(leafRow);
      }

      this.populateLocationByNPS(series[i].SubSeries, currentRow);
    }
  }

  private populatePSMByNPS(series, parentRow): void {
    let currentRow = parentRow ? parentRow : [];

    for (let i = 0; i < series.length; i++) {
      if (series[i].Header === 2 && series[i].SubSeries.length > 0) {
        currentRow = parentRow.slice();
        currentRow.push(series[i].Text);
      } else if (series[i].SubSeries.length === 0) {
        let leafRow = parentRow.slice();

        leafRow.push(series[i].Text);
        leafRow.push(series[i].Index);

        this.psmByNPSTable.push(leafRow);
      }

      this.populatePSMByNPS(series[i].SubSeries, currentRow);
    }
  }

  public getBgColor(data) {
    if (data <= 0) {
      return "#dc3545";
    }
    else if (data > 0 && data <= 60) {
      return "#ffcc00";
    }
    else if (isNaN(data) || data === 'NaN') {
      return "transparent";
    }
    else { return "#28a745" }
  }

}
