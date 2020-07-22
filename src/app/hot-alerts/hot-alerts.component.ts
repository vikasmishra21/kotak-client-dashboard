import { Component, OnInit } from '@angular/core';
import { FilterService } from '../shell/services/filter.service';
import { FilterConfig } from '../shell/models/filterConfig';
import { FilterType } from '../shell/enums/filter-type';
import { VariableType } from '../shell/enums/variable-type';
import { Chart } from '../shell/models/chart';
import { HotAlertTables } from './tables/hot-alert-tables';
import { Subject, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { ThrowStmt } from '@angular/compiler';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';
import * as _ from 'underscore';

@Component({
  selector: 'app-hot-alerts',
  templateUrl: './hot-alerts.component.html',
  styleUrls: ['./hot-alerts.component.sass']
})
export class HotAlertsComponent implements OnInit {
  public filterConfigs = {
    location: null,
    branchCode: null
  };
  public hotAletTableConfig: Chart;
  public hotAlertTableRespondentConfig: Chart;
  public onDataUpdate: Subject<any> = new Subject<any>();
  public onDataUpdateAlertPopUp: Subject<any> = new Subject<any>();
  public hotAlertTable: any[][];
  public headers: any[] = [];
  public surveyReviewData: any;
  public popUpHideChart = false;
  public showLoader: boolean;
  public noOfRespondant: Subscription;
  public respondantBase: number;
  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  constructor(private filterService: FilterService, private respondant: GenericRespondantShare, private matDialog: MatDialog) {
    this.noOfRespondant = this.respondant.getRespondant().subscribe(data => {
      this.respondantBase = data;
      this.setPage(1);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
  }

  ngOnInit() {
    this.showLoader = true;
    // this.filterConfigs.location = this.filterService.getFilterConfig('v52');
    // this.filterConfigs.branchCode = this.filterService.getFilterConfig('v53');

    // this.initializeTable();
    this.setPage(1);

    this.filterService.optionSelectionCallback$.subscribe(value => {
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });

    // To bring data without a filter selected.
    this.filterService.setChoices('v5', []);
  }

  openDialog(rowArray) {
    let count = 0;
    for (const id of rowArray) {
      if (count === 0) {
        this.popUpTable(id);
        setTimeout(() => {
          this.onDataUpdateAlertPopUp.next();
        });
        break;
      }
      count++;
    }

  }

  public initializeTable(page) {
    this.showLoader = true;
    this.hotAletTableConfig = HotAlertTables.getHotAlertTableConfig(page);
    this.hotAletTableConfig.addTableDataReady((output, dataTable, rawData) => {
      this.hotAlertTable = [];
      this.showLoader = false;
      this.headers = dataTable.headers;
      let dataRow: any = dataTable.rows.get('');

      for (let i = 0; i < dataRow.length; i += dataTable.headers.length) {
        let row = [];

        for (let j = 0; j < dataTable.headers.length; j++) {
          if (dataRow[i + j].toString() === 'NaN') {
            dataRow[i + j] = '';
          }
          row.push(dataRow[i + j]);
        }
        this.hotAlertTable.push(row);
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.getPager(this.respondantBase, page, 20);
    this.initializeTable(page);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 20) {
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    let pages = _.range(startPage, endPage + 1, 1);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }


  public popUpTable(id) {
    this.hotAlertTableRespondentConfig = HotAlertTables.getHotAlertTableRespondentData(id);
    this.popUpHideChart = true;
    this.showLoader = true;
    this.hotAlertTableRespondentConfig.addTableDataReady((output, dataTable, rawData) => {
      this.surveyReviewData = [];
      this.showLoader = false;

      for (let i = 0; i < rawData.category.length; i++) {
        let surveyReviewRow = [];

        surveyReviewRow.push(rawData.category[i].Text);
        surveyReviewRow.push(rawData.data[0][i]);

        this.surveyReviewData.push(surveyReviewRow);
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.surveyReviewData;
      let dialogRef = this.matDialog.open(DialogBodyComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(value => {
        // console.log(`Dialog sent: ${value}`);
        this.popUpHideChart = false;
      });
    });
  }

  getContentWidth() {
    var width = document.getElementById("hotAlertTable").offsetWidth;
    return width;
  }

  getContentHeight() {
    return window.innerHeight -275;
  }

}
