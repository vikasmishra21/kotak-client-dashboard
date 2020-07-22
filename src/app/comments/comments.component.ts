import { Component, OnInit } from '@angular/core';
import { FilterService } from '../shell/services/filter.service';
import { Chart } from '../shell/models/chart';
import { Subject, config, Subscription } from 'rxjs';
import { FilterType } from '../shell/enums/filter-type';
import { VariableType } from '../shell/enums/variable-type';
import { CommentsTable } from './tables/comment-tables';
import { FilterConfig } from '../shell/models/filterConfig';
import { FilterOption } from '../shell/models/filterOption';
import { Collection } from '../shell/models/collection';
import { GenericRespondantShare } from '../services/generic-respondant-share.services';
import * as _ from 'underscore';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.sass']
})
export class CommentsComponent implements OnInit {
  public selectedTab = 'positive';
  public filterConfigs = {
    region: null,
    category: null
  };
  public onDataUpdate: Subject<any> = new Subject<any>();
  public onRecommendationUpdate: Subject<any> = new Subject<any>();
  public onBubbleChartUpdate: Subject<any> = new Subject<any>();
  public commentsTableConfig: Chart;
  public recommendationTableConfig: Chart;
  public bubbleChartConfig: Chart;
  public commentsTable: any[][];
  public headers: string[];
  public categoryChartConfig: Chart;
  public categories: any[];
  public selectedTableNet = 'positive';
  public showLoader: boolean;
  public showBubbleChartConfig: boolean = false;

  public noOfRespondant: Subscription;
  public scaling: Subscription;
  public respondantBase: number;
  public isScaleTo100: boolean = false;
  public labelsShow: Subscription;
  public isLabelsShow: boolean = false;
  public onChangeScale: boolean = false;
  pager: any = {};
  pagedItems: any[];
  baseCount: number;

  constructor(private filterService: FilterService, private respondant: GenericRespondantShare) {
    this.noOfRespondant = this.respondant.getRespondant().subscribe(data => {
      this.setPage(1);
      this.respondantBase = data;
    });
    this.scaling = this.respondant.getScaleFlag().subscribe(data => {
      this.onChangeScale = false;
      this.isScaleTo100 = data;
      this.initializeCharts();
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
    this.labelsShow = this.respondant.getLabelsFlag().subscribe(data => {
      this.onChangeScale = false;
      this.isLabelsShow = data;
      this.initializeCharts();
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });
  }

  ngOnInit() {
    this.showLoader = true;
    // this.filterConfigs.region = this.filterService.getFilterConfig('v57');
    // this.filterConfigs.category = this.filterService.getFilterConfig('v81');

    // this.initializeTable();
    this.setPage(1);
    this.initializeCharts();

    this.filterService.optionSelectionCallback$.subscribe(value => {
      this.showLoader = true;
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    });

    // To bring data without a filter selected.
    // this.filterService.setChoices('v82', []);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  public onTabClick(tabName) {
    if (tabName === this.selectedTab) {
      return;
    }

    this.selectedTab = tabName;
    this.setPage(1);
    // this.initializeTable();
    this.initializeCharts();
    // this.filterService.setChoices('v82', []);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  private initializeTable(page) {
    this.showLoader = true;
    this.commentsTableConfig = CommentsTable.getCommentsTableConfig(this.selectedTab, page);
    this.recommendationTableConfig = CommentsTable.getRcommendationConfig(this.selectedTab);

    this.commentsTableConfig.addTableDataReady((output, dataTable, rawData) => {
      this.showLoader = false;
      this.commentsTable = [];
      this.headers = dataTable.headers;
      let dataRow: any = dataTable.rows.get('');
      this.baseCount = rawData.basecount;
      for (let i = 0; i < dataRow.length; i += dataTable.headers.length) {
        let row = [];

        for (let j = 0; j < dataTable.headers.length; j++) {
          if (dataRow[i + j].toString() === 'NaN') {
            dataRow[i + j] = '';
          }
          row.push(dataRow[i + j]);
        }

        this.commentsTable.push(row);
      }
    });

    this.recommendationTableConfig.addTableDataReady((output, dataTable, rawData) => {
      this.createRegressionChartConfig(output);
      this.showBubbleChartConfig = true;
      setTimeout(() => {
        this.onBubbleChartUpdate.next();
        this.showLoader = false;
      });
    });
  }

  private initializeCharts() {
    this.showLoader = true;
    this.categoryChartConfig = CommentsTable.getCategoryConfig(this.selectedTab, this.isScaleTo100, this.isLabelsShow);
    this.onChangeScale = true;

    this.categoryChartConfig.addCalculationLogic(output => {
      this.showLoader = false;
      this.categories = [];
      // this.onChangeScale = false;
      for (const categoriesValue of output.TableOutput) {
        for (const catIndex in categoriesValue[1]) {
          if (categoriesValue[1].hasOwnProperty(catIndex)) {
            const element = categoriesValue[1][catIndex];
            let Score = element.Score as number | string === 'NaN' ? 0 : element.Score;
            this.categories.push({ text: element.SeriesName, variableName: element.SeriesVariableID, value: Score, seriesCode: element.SeriesCode });
            // this.categories[catIndex].value = Score;
          }
        }
      }

      output.TableOutput.get('Categories').sort((a, b) => {
        return b.Score - a.Score;
      });

      return output;
    });

    if (this.categoryChartConfig) {
      setTimeout(() => {
        this.onRecommendationUpdate.next();
      });
    }
  }

  private createRegressionChartConfig(recommendation) {
    this.showLoader = true;
    this.bubbleChartConfig = CommentsTable.getCommentsBubbleConfig(this.selectedTab);

    this.bubbleChartConfig.addChartConfigChange((output, config, rawData) => {
      this.showLoader = false;
      config = {};

      config.height = '90%';
      config.width = '550px';
      config.grid = {
        height: '80%',
        width: '75%',
        top: 20,
        left: '15%'
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
        show: true,
        position: 'right'
      };
      config.series = [
        {
          name: 'Regression',
          data: [],
          type: 'scatter',
          symbolSize: 20
        }
      ];

      rawData.RegressionResult.Summary.forEach((summary, index) => {
        if (summary.variableID === 'intercept' || summary.OptionCode === '25' || summary.OptionCode === '26') {
          return;
        }

        let cat = this.categories.find(x => x.text === summary.OptionText);
        let recommendationSeries = recommendation.find(x => x.SeriesName === summary.OptionText);

        if (cat === undefined || recommendationSeries === undefined) {
          return;
        }

        let recommendationScore = recommendationSeries.Score;

        config.series[0].data.push({
          name: cat.text,
          value: [recommendationScore, summary.Coefficients.toFixed(2)],
          symbolSize: cat.value,
          itemStyle: {
            color: '#0000d8'
          }
        });
      });

      return config;
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // this.initializeTable(page);
    this.pager = this.getPager(this.baseCount, page, 20);
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

  getContentHeight() {
    return document.getElementById("chartCol").offsetHeight;
  }

  getContentWidth() {
    var width = document.getElementById("commentsTable").offsetWidth;
    return width;
  }
}
