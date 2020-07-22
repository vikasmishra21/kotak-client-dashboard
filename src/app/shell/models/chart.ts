import { BasicUtil } from '../util/basicUtil';
import { ChartTypes } from '../enums/chart.types';
import { Measure } from '../enums/measure';
import { ChartConfig } from '../interfaces/chart-config';
import { CollectionOutput } from './collectionOutput';
import {
  AfterChartClick,
  AfterConfigReady,
  AfterDataFetch,
  AfterNodeClick,
  AfterTableDataReady
} from '../interfaces/after-data-fetch';
import { FilterCondition } from '../enums/filter-condition.enum';
import { TableOutput } from '../interfaces/table-output';
import { DataTable } from './dataTable';
import { BreakType, Nestable } from '../operators/chart.operators';
import { RoundOffStrategy } from '../enums/round.off.strategy';
import { RoundOff } from '../interfaces/round.off';
import { ChartProvider } from '../enums/chart.provider';
import { ChartProviderConfiguration } from '../interfaces/chart-provider-configuration';
import { AnalysisType } from '../enums/analysis-type';

export class Chart {
  Name: string;
  SideBreak: string[];
  TopBreak: string[];
  IndependentVariables?: string[];
  Type: ChartTypes;
  Measure: Measure;
  AnalysisType?: AnalysisType;
  RegressionType?: number;
  IsContinousVariable?: boolean;
  UseCache?: boolean;
  ExcludeFilters?: string[];
  private isTransposeTable: boolean;
  private rowColumn: [string, string];
  private weight: string;
  private SideBreakOperation: BreakOperation;
  private TopBreakOperation: BreakOperation;
  private dataReadyCallback: AfterDataFetch;
  private configReadyCallback: AfterConfigReady;
  private tableDataCallback: AfterTableDataReady;
  private collectionFilter: Array<any>;
  private nodeClickCallback: AfterNodeClick;
  private chartClickCallback: AfterChartClick;
  private timeComparison: any;
  private showOverall: boolean;
  private showAllSeries: boolean;
  private Pagesize: number;
  private Pageoffset: number;
  private ShowHeader: boolean;
  private calculationRoundOff: RoundOff;
  public showLoader: boolean;
  private chartProvider: ChartProvider;
  private displayNoAnswer: boolean;
  private hasSigTest: boolean;

  constructor(config: ChartConfig, name?: string, chartProvider?: ChartProvider) {
    this.SideBreak = config.SideBreak;
    this.TopBreak = config.TopBreak;
    this.Type = config.Type || ChartTypes.BarChart;
    this.Measure = config.Measure || Measure.ColumnPercent;
    this.Name = name || BasicUtil.newGuid();
    this.chartProvider = chartProvider || ChartProvider.ECharts;
    this.weight = '';
    this.SideBreakOperation = new BreakOperation();
    this.TopBreakOperation = new BreakOperation();
    this.rowColumn = [undefined, undefined];
    this.showOverall = false;
    this.showAllSeries = false;
    this.Pagesize = 500;
    this.Pageoffset = 1;
    this.displayNoAnswer = false;
    this.collectionFilter = new Array<any>();
    this.showLoader = true;
    this.ExcludeFilters = config.ExcludeFilters;
    this.calculationRoundOff = {
      type: RoundOffStrategy.AfterCalculation,
      decimal: undefined
    };
    this.timeComparison = {
      isEnabled: false,
      roundOffStrategy: RoundOffStrategy.BeforeBinding,
      decimalPlaces: 0
    };
    this.AnalysisType = config.AnalysisType;
    this.IndependentVariables = config.IndependentVariables;
    this.RegressionType = config.RegressionType;
    this.IsContinousVariable = config.IsContinousVariable;
    this.UseCache = config.UseCache;
  }

  enableSigTest() {
    this.hasSigTest = true;
  }

  isSigTestEnabled(): boolean {
    return this.hasSigTest || false;
  }

  enableTimeComparison(roundOffStrategy: RoundOffStrategy, precision?: number) {
    this.timeComparison.isEnabled = true;
    this.timeComparison.roundOffStrategy = roundOffStrategy;
    this.timeComparison.decimalPlaces = precision || 0;
  }

  getTimeComparisonProperties() {
    return this.timeComparison;
  }

  addCollectionFilter(filterVariable: string, values: number[], filterCondition: FilterCondition) {
    this.collectionFilter.push({
      variable: filterVariable,
      data: values,
      condition: filterCondition
    });
  }

  showChartHeading(isShown: boolean) {
    this.ShowHeader = isShown;
  }

  isHeaderShown(): boolean {
    return this.ShowHeader;
  }

  getChartProvider(): ChartProvider {
    return this.chartProvider;
  }

  getCollectionFilters() {
    return this.collectionFilter;
  }

  addCollectionWeight(variable: string) {
    this.weight = variable;
  }

  addShowAllSeries(showAllSeries: boolean) {
    this.showAllSeries = showAllSeries;
  }

  getShowAllSeries() {
    return this.showAllSeries;
  }
  addDataPagination(pageSize: number, pageoffset: number) {
    this.Pagesize = pageSize;
    this.Pageoffset = pageoffset;
  }

  getDataPagination() {
    return { pageSize: this.Pagesize, pageoffset: this.Pageoffset }
  }

  addShowOverall(showOverall: boolean) {
    this.showOverall = showOverall;
  }

  getShowOverall() {
    return this.showOverall;
  }

  getCollectionWeight(): string {
    return this.weight;
  }

  showSideBreakBase(index: number, showBase: boolean) {
    this.SideBreakOperation.base[index] = showBase;
  }

  showSideBreakUnWeightedBase(index: number, showBase: boolean) {
    this.SideBreakOperation.unWeightedBase[index] = showBase;
  }

  isSideBreakBaseShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.SideBreakOperation.base[index] || false;
    }
    return this.SideBreakOperation.base[index + '>' + parentKey] || false;
  }

  setSideBreakUnWeightedBaseMeasure(index: number, measure: Measure) {
    this.SideBreakOperation.unWeightedBaseMeasure[index] = measure;
  }

  getSideBreakUnWeightedBaseMeasure(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.SideBreakOperation.unWeightedBaseMeasure[index];
    }
    return this.SideBreakOperation.unWeightedBaseMeasure[index + '>' + parentKey];
  }

  isSideBreakUnWeightedBaseShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.SideBreakOperation.unWeightedBase[index] || false;
    }
    return this.SideBreakOperation.unWeightedBase[index + '>' + parentKey] || false;
  }

  showTopBreakBase(index: number, showBase: boolean) {
    this.TopBreakOperation.base[index] = showBase;
  }

  showTopBreakUnWeightedBase(index: number, showBase: boolean) {
    this.TopBreakOperation.unWeightedBase[index] = showBase;
  }

  isTopBreakBaseShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.TopBreakOperation.base[index] || false;
    }
    return this.TopBreakOperation.base[index + '>' + parentKey] || false;
  }

  setTopBreakUnWeightedBaseMeasure(index: number, measure: Measure) {
    this.TopBreakOperation.unWeightedBaseMeasure[index] = measure;
  }

  getTopBreakUnWeightedBaseMeasure(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.TopBreakOperation.unWeightedBaseMeasure[index];
    }
    return this.TopBreakOperation.unWeightedBaseMeasure[index + '>' + parentKey];
  }

  isTopBreakUnWeightedBaseShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.TopBreakOperation.unWeightedBase[index] || false;
    }
    return this.TopBreakOperation.unWeightedBase[index + '>' + parentKey] || false;
  }

  showSideBreakTotal(index, show: boolean) {
    this.SideBreakOperation.total[index] = show;
  }

  isSideBreakTotalShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.SideBreakOperation.total[index] || false;
    }
    return this.SideBreakOperation.total[index + '>' + parentKey] || false;
  }

  showTopBreakTotal(index, show: boolean) {
    this.TopBreakOperation.total[index] = show;
  }

  isTopBreakTotalShown(index: number, parentKey?: string) {
    if (parentKey === undefined) {
      return this.TopBreakOperation.total[index] || false;
    }
    return this.TopBreakOperation.total[index + '>' + parentKey] || false;
  }

  showSideBreakOptions(index: number, options: number[]) {
    this.SideBreakOperation.show[index] = options;
  }

  showTopBreakOptions(index: number, options: number[]) {
    this.TopBreakOperation.show[index] = options;
  }

  hideSideBreakOptions(index: number, options: number[]) {
    this.SideBreakOperation.hide[index] = options;
  }

  hideTopBreakOptions(index: number, options: number[]) {
    this.TopBreakOperation.hide[index] = options;
  }

  combineSideBreakOptions(variable: string, options: number[], name?: string) {
    if (!Array.isArray(this.SideBreakOperation.combine[variable])) {
      this.SideBreakOperation.combine[variable] = [];
    }
    if (!Array.isArray(this.SideBreakOperation.combineNames[variable])) {
      this.SideBreakOperation.combineNames[variable] = [];
    }
    this.SideBreakOperation.combine[variable].push(options);
    this.SideBreakOperation.combineNames[variable].push(name);
  }

  combineTopBreakOptions(variable: string, options: number[], name?: string) {
    if (!Array.isArray(this.TopBreakOperation.combine[variable])) {
      this.TopBreakOperation.combine[variable] = [];
    }
    if (!Array.isArray(this.TopBreakOperation.combineNames[variable])) {
      this.TopBreakOperation.combineNames[variable] = [];
    }
    this.TopBreakOperation.combine[variable].push(options);
    this.TopBreakOperation.combineNames[variable].push(name);
  }

  getSideBreakShownOptions(index: number, parentKey?: string): Array<number> {
    if (parentKey === undefined) {
      return this.SideBreakOperation.show[index] || [];
    }
    return this.SideBreakOperation.show[index + '>' + parentKey] || [];
  }

  getTopBreakShownOptions(index: number, parentKey?: string): Array<number> {
    if (parentKey === undefined) {
      return this.TopBreakOperation.show[index] || [];
    }
    return this.TopBreakOperation.show[index + '>' + parentKey] || [];
  }

  getSideBreakHiddenOptions(index: number, parentKey?: string): Array<number> {
    if (parentKey === undefined) {
      return this.SideBreakOperation.hide[index] || [];
    }
    return this.SideBreakOperation.hide[index + '>' + parentKey] || [];
  }

  getTopBreakHiddenOptions(index: number, parentKey?: string): Array<number> {
    if (parentKey === undefined) {
      return this.TopBreakOperation.hide[index] || [];
    }
    return this.TopBreakOperation.hide[index + '>' + parentKey] || [];
  }

  getSideBreakCombinedOptions(variable: string): Array<number> {
    return this.SideBreakOperation.combine[variable] || [];
  }

  getTopBreakCombinedOptions(variable: string): Array<number> {
    return this.TopBreakOperation.combine[variable] || [];
  }

  getSideBreakCombinedNames(variable: string): string[] {
    return this.SideBreakOperation.combineNames[variable] || [];
  }

  getTopBreakCombinedNames(variable: string): string[] {
    return this.TopBreakOperation.combineNames[variable] || [];
  }

  setSideBreakFilter(sideBreakVariable: string, filterVariable: string,
    values: number[], filterCondition: FilterCondition, index?: number) {
    this.applyFilterOnBreak.apply(this, ['SideBreak', ...Array.prototype.slice.apply(arguments)]);
  }

  setTopBreakFilter(topBreakVariable: string, filterVariable: string,
    values: number[], filterCondition: FilterCondition, index?: number) {
    this.applyFilterOnBreak.apply(this, ['TopBreak', ...Array.prototype.slice.apply(arguments)]);
  }

  getSideBreakFilter(index: number): [] {
    if (index > -1) {
      return this.SideBreakOperation.filter[index] || [];
    }
    return [];
  }

  getTopBreakFilter(index: number): [] {
    if (index > -1) {
      return this.TopBreakOperation.filter[index] || [];
    }
    return [];
  }

  nestSideBreak(index: string, nestVariables: string[]) {
    this.SideBreakOperation.nest[index] = nestVariables;
  }

  nestTopBreak(index: string, nestVariables: string[]) {
    this.TopBreakOperation.nest[index] = nestVariables;
  }

  getSideBreakNest(sideBreakVariable: string) {
    return this.SideBreakOperation.nest[sideBreakVariable] || [];
  }

  getTopBreakNest(topBreakVariable: string) {
    return this.TopBreakOperation.nest[topBreakVariable] || [];
  }

  includeNotAnswered(isShown: boolean) {
    this.displayNoAnswer = isShown;
  }

  isNoAnswerIncluded(): boolean {
    return this.displayNoAnswer;
  }

  addCalculationLogic(callback: AfterDataFetch, roundOffStrategy?: RoundOffStrategy, decimalPlaces?: number) {
    this.dataReadyCallback = callback;
    this.calculationRoundOff.type = roundOffStrategy || RoundOffStrategy.AfterCalculation;
    this.calculationRoundOff.decimal = decimalPlaces || 2;
  }

  onDataFetch(output: CollectionOutput): CollectionOutput {
    return typeof this.dataReadyCallback === 'function' ? this.dataReadyCallback(output) : output;
  }

  getCalculationRoundOffStrategy(): RoundOff {
    return this.calculationRoundOff;
  }

  addChartConfigChange(callback: AfterConfigReady) {
    this.configReadyCallback = callback;
  }

  onConfigReady(output: TableOutput[], config: ChartProviderConfiguration, rawData: any): ChartProviderConfiguration {
    return typeof this.configReadyCallback === 'function' ? this.configReadyCallback(output, config, rawData) : config;
  }

  transposeTable(isTranspose: boolean) {
    this.isTransposeTable = isTranspose;
  }

  addRowColumnFields(row: string, column: string) {
    this.rowColumn = [row, column];
  }

  isTableTransposed(): boolean {
    return this.isTransposeTable;
  }

  getRowColumn(): [string, string] {
    return this.rowColumn;
  }

  addTableDataReady(callback: AfterTableDataReady) {
    this.tableDataCallback = callback;
  }

  onTableDataReady(output: TableOutput[], dataTable: DataTable, rawData: any): void {
    if (typeof this.tableDataCallback === 'function') {
      this.tableDataCallback(output, dataTable, rawData);
    }
  }

  // this is to add a callback of click event of node in chart
  addNodeClick(callback: AfterNodeClick) {
    this.nodeClickCallback = callback;
  }

  // this will be called on click of chart nodes
  onNodeClick(node: any): void {
    if (typeof this.nodeClickCallback === 'function') {
      this.nodeClickCallback(node);
    }
  }

  // this is to add a callback of click event of chart in chart
  addChartClick(callback: AfterChartClick) {
    this.chartClickCallback = callback;
  }

  // this will be called on click of chart in chart
  onChartClick(node: any): void {
    if (typeof this.chartClickCallback === 'function') {
      this.chartClickCallback(node);
    }
  }

  /* Version 2.0 */

  getBreakOperation(breakType: BreakType) {
    return this[breakType + 'Operation'];
  }

  setBreakOperation(breakType: BreakType, operations: any) {
    this[breakType + 'Operation'] = operations;
  }

  for(breakType: BreakType): Nestable {
    return new Nestable(this, breakType);
  }

  private applyFilterOnBreak(...params) {
    const targetBreak = params[0];
    const breakVariable = params[1];
    const filterVariable = params[2];
    const values = params[3];
    const filterCondition = params[4];
    let index = params[5];
    const hasMultipleOccurence: boolean = this[targetBreak].reduce((count, current) => {
      if (current === breakVariable) {
        return count + 1;
      }
      return count;
    }, 0) > 1;
    if (index === undefined) {
      if (hasMultipleOccurence) {
        throw new Error(`Multiple ${targetBreak} variables with same name,
          'Please specify the index of ${targetBreak} variable on which you want to apply filter. Use -1 to apply for all occurence`);
      } else {
        index = this[targetBreak].indexOf(breakVariable);
      }
    }
    const addFilter = (i) => {
      if (typeof this[targetBreak + 'Operation'].filter[i] !== 'object') {
        this[targetBreak + 'Operation'].filter[i] = [];
      }
      this[targetBreak + 'Operation'].filter[i].push({
        variable: filterVariable,
        data: values,
        condition: filterCondition
      });
    };
    if (index > -1) {
      addFilter(index);
    } else {
      this[targetBreak].map((b, i) => addFilter(i));
    }
  }
}

class BreakOperation {
  show = {};
  hide = {};
  combine = {};
  combineNames = {};
  filter = {};
  nest = {};
  base = {};
  unWeightedBase = {};
  unWeightedBaseMeasure = {};
  total = {};
}

export interface ChartFilter {
  variable: string;
  data: [];
  condition: FilterCondition;
}
