import { Component, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from '../shell/models/chart';
import { NPSOverview } from './tables/nps-overview';
import { FilterService } from '../shell/services/filter.service';
import { Subject, Subscription } from 'rxjs';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';

@Component({
  selector: 'app-nps-overview',
  templateUrl: './nps-overview.component.html',
  styleUrls: ['./nps-overview.component.sass']
})
export class NpsOverviewComponent implements OnInit {
  public onDataUpdate: Subject<any> = new Subject<any>();
  public npsChart: Chart;
  public mainReasonChart: Chart;
  public numberOfMachinesChart: Chart;
  public npsByRegionChart: Chart;
  public storeTypeChart: Chart;
  public wordlineChart: Chart;
  public npsByTimesVisited: Chart;

  public locationByNPSTableConfig: Chart;
  public locationByNPSTable: any[][] = [];
  public top5LocationsByNPS: any[][];
  public bottom5LocationByNPS: any[][];
  public psmByNPSTableConfig: Chart;
  public psmByNPSTable: any[][];
  public top5PSMByNPS: any[][];
  public bottom5PSMByNPS: any[][];
  public base: number;
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
    this.initializeTables();

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

  private initializeCharts() {
    // this.onChangeScale = false;
    this.showLoader = true;
    this.npsChart = NPSOverview.getNPSChartConfig();
    this.mainReasonChart = NPSOverview.getMainReasonChart(this.isScaleTo100, this.isLabelsShow);
    this.numberOfMachinesChart = NPSOverview.getNumberOfMachinesChart(this.isScaleTo100, this.isLabelsShow);
    this.npsByRegionChart = NPSOverview.getNPSByRegionChart(this.isScaleTo100, this.isLabelsShow);
    this.storeTypeChart = NPSOverview.getStoreTypeChart(this.isScaleTo100, this.isLabelsShow);
    this.wordlineChart = NPSOverview.getWordlineChart(this.isScaleTo100, this.isLabelsShow);
    this.npsByTimesVisited = NPSOverview.getNPSByTimesVisitedChart(this.isScaleTo100, this.isLabelsShow);
    this.onChangeScale = true;
  }

  private initializeTables() {
    this.showLoader = true;
    this.locationByNPSTableConfig = NPSOverview.getTopBottomLocationTable();
    this.locationByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
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

      let maxRows = (5 <= this.locationByNPSTable.length ? 5 : this.locationByNPSTable.length);

      for (let i = 0; i < maxRows; i++) {
        this.top5LocationsByNPS.push(this.locationByNPSTable[i]);
      }

      maxRows = (5 <= this.locationByNPSTable.length ? (this.locationByNPSTable.length - 5) : 0);

      for (let i = (this.locationByNPSTable.length - 1); i >= maxRows; i--) {
        this.bottom5LocationByNPS.push(this.locationByNPSTable[i]);
      }

      this.showLoader = false; // Turning off loader here because this table takes the maximum time to load.
    });

    this.psmByNPSTableConfig = NPSOverview.getTopBottomPSMTable();
    this.psmByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
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

      let maxRows = (5 <= this.psmByNPSTable.length ? 5 : this.psmByNPSTable.length);

      for (let i = 0; i < maxRows; i++) {
        this.top5PSMByNPS.push(this.psmByNPSTable[i]);
      }

      maxRows = (5 <= this.psmByNPSTable.length ? (this.psmByNPSTable.length - 5) : 0);

      for (let i = (this.psmByNPSTable.length - 1); i >= maxRows; i--) {
        this.bottom5PSMByNPS.push(this.psmByNPSTable[i]);
      }
    });
    // this.onChangeScale = true;
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
      return "rgba(253,57,122,.1)";
    }
    else if (data > 0 && data <= 60) {
      return "rgba(255,184,34,.1)";
    }
    else if (isNaN(data) || data === 'NaN') {
      return "#f2f2f2";
    }
    else { return "rgba(10,187,135,.1)" }

  }

  public getTextColor(data) {
    if (data <= 0) {
      return "#dc3545";
    }
    else if (data > 0 && data <= 60) {
      return "#ffb822";
    }
    else if (isNaN(data) || data === 'NaN') {
      return "#003772";
    }
    else { return "#0abb87" }

  }
}
