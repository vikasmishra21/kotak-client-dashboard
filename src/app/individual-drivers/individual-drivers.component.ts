import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { Chart } from '../shell/models/chart';
import { IndividualDriverTables } from './tables/individual-driver-tables';
import { FilterService } from '../shell/services/filter.service';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';

@Component({
  selector: 'app-individual-drivers',
  templateUrl: './individual-drivers.component.html',
  styleUrls: ['./individual-drivers.component.sass']
})
export class IndividualDriversComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription;
  private filterVariable: string;

  public title: string;
  public icon: string;
  public color: string;
  public tableNets = [
    { text: 'Mean', value: 'mean' },
    { text: 'Top 2', value: 'top2' },
    { text: 'Bot 2', value: 'bot2' },
    { text: 'Bot 6', value: 'bot6' }
  ];
  public onDataUpdate: Subject<any> = new Subject<any>();
  public selectedTableNet = 'top2';
  public driverConfig: Chart;
  public numberOfMachinesConfig: Chart;
  public driverByRegionConfig: Chart;
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
  public showTableNets: boolean = true;
  public scaling: Subscription;
  public isScaleTo100: boolean = false;
  public labelsShow: Subscription;
  public isLabelsShow: boolean = false;
  public onChangeScale: boolean = false;

  constructor(private filterService: FilterService, private respondant: GenericRespondantShare,
    private route: ActivatedRoute) {
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
    this.routeDataSubscription = this.route.data.subscribe((value) => {
      this.title = value.title;
      this.icon = value.icon;
      this.color = value.color;
      this.filterVariable = value.variable;
    });

    this.initializeCharts();
    this.initializeTables();

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

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }

  onTableNettingChange(changedSelectedTableNet) {
    this.selectedTableNet = changedSelectedTableNet;
    this.initializeCharts();
    this.initializeTables();
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  private initializeCharts() {
    this.showLoader = true;
    this.driverConfig = IndividualDriverTables.getDriverConfig(this.filterVariable, this.selectedTableNet, this.color);
    this.numberOfMachinesConfig = IndividualDriverTables.getNumberOfMachinesChart(this.filterVariable, this.selectedTableNet, this.color, this.isScaleTo100, this.isLabelsShow);
    this.driverByRegionConfig = IndividualDriverTables.getDriverByRegionChart(this.filterVariable, this.selectedTableNet, this.color, this.isScaleTo100, this.isLabelsShow);
    this.storeTypeConfig = IndividualDriverTables.getStoreTypeChart(this.filterVariable, this.selectedTableNet, this.color, this.isScaleTo100, this.isLabelsShow);
    this.onChangeScale = true;
  }

  private initializeTables() {
    this.showLoader = true;
    this.locationByNPSTableConfig = IndividualDriverTables.getTopBottomLocationTable(this.filterVariable, this.selectedTableNet);
    this.locationByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
      // setTimeout(() => {
      //   this.showLoader = false;
      // }, 8500);
      this.locationByNPSTable = [];
      this.populateLocationByNPS(rawData.series);

      for (let i = 0; i < this.locationByNPSTable.length; i++) {
        let rowIndex = this.locationByNPSTable[i][2];
        let baseIndex = this.locationByNPSTable[i][3];

        if (rawData.data[rowIndex][0] !== 'NaN') {
          this.locationByNPSTable[i][2] = rawData.data[rowIndex][0].toFixed(2);
        } else {
          this.locationByNPSTable[i][2] = -1;
        }
      }

      let newTable = [];
      this.locationByNPSTable.forEach(x => {
        if (x[2] !== -1) {
          newTable.push(x);
        }
      });

      this.locationByNPSTable = newTable;

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

      this.showLoader = false;
    });

    this.psmByNPSTableConfig = IndividualDriverTables.getTopBottomPSMTable(this.filterVariable, this.selectedTableNet);
    this.psmByNPSTableConfig.addTableDataReady((output, dataTable, rawData) => {
      // setTimeout(() => {
      //   this.showLoader = false;
      // }, 8500);
      this.psmByNPSTable = [];
      this.populatePSMByNPS(rawData.series, null);

      for (let i = 0; i < this.psmByNPSTable.length; i++) {
        let rowIndex = this.psmByNPSTable[i][3];
        let baseIndex = this.psmByNPSTable[i][4];

        if (rawData.data[rowIndex][0] !== 'NaN') {
          this.psmByNPSTable[i][3] = rawData.data[rowIndex][0].toFixed(2);
        } else {
          this.psmByNPSTable[i][3] = -1;
        }
      }

      let newTable = [];
      this.psmByNPSTable.forEach(x => {
        if (x[3] !== -1) {
          newTable.push(x);
        }
      });

      this.psmByNPSTable = newTable;

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
        leafRow.push(series[i].BaseIndex);

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
        leafRow.push(series[i].BaseIndex);

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
