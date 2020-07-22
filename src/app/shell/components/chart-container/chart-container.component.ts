import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chart } from '../../models/chart';
import { CommunicationService } from '../../services/communication.service';
import { CollectionUtil } from '../../util/collectionUtil';
import { takeUntil, filter } from 'rxjs/operators';
import { DataTransformer } from '../../util/dataTransformer';
import { ChartTypes } from '../../enums/chart.types';
import { ChartConfiguration } from '../../util/chartConfiguration';
import { Observable, Subject } from 'rxjs';
import { DataTable } from '../../models/dataTable';
import { FilterService } from '../../services/filter.service';
import { VariableMap } from '../../interfaces/variable-map';
import { FilterOption } from '../../models/filterOption';
import { FilterCondition } from '../../enums/filter-condition.enum';
import { CollectionOutput } from '../../models/collectionOutput';
import { TimePeriod } from '../../models/time.period';
import { RoundOff } from '../../interfaces/round.off';
import { ChartProvider } from '../../enums/chart.provider';
import { ChartProviderConfiguration } from '../../interfaces/chart-provider-configuration';
import { VariableType } from '../../enums/variable-type';
import { AnalysisType } from '../../enums/analysis-type';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit, OnDestroy {
  private _chart: Chart;

  get chart(): Chart {
    return this._chart;
  }

  @Input() set chart(chart: Chart) {
    this._chart = chart;
  }

  @Input() updateData: Subject<any> = new Subject<any>();
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  chartSubject: Subject<ChartProviderConfiguration> = new Subject();
  data: object;
  chartConfig: ChartProviderConfiguration;
  nodata: boolean;
  showHeader: boolean;
  provider: ChartProvider;
  isKPI: boolean;

  constructor(
    private communicationService: CommunicationService,
    private filterService: FilterService
  ) {
    this.data = { data: [] };
    this.chartSubject.next(this.chartConfig);
  }

  ngOnInit() {
    this.showHeader = this.chart.isHeaderShown();
    this.provider = this.chart.getChartProvider();
    this.isKPI = this.chart.Type === ChartTypes.KPI;
    this.updateData
      .pipe(takeUntil(this.updateDataUnsubscribe))
      .subscribe(d => {
        this.getCollection().subscribe(output => this.processOutput(output));
      });
  }

  private getCollection(): Observable<CollectionOutput> {
    const collection = CollectionUtil.createCollection(this.chart);
    this.filterService
      .getAppliedFilters()
      .forEach((value: FilterOption[], variable: string) => {
        const variableMap: VariableMap = CollectionUtil.getVariableMap(
          variable
        );

        if (this.chart.ExcludeFilters && this.chart.ExcludeFilters.indexOf(variable) !== -1) {
          return;
        }


        if (variableMap.type === VariableType.Numeric) {
          collection.addFilter({
            variableName: variable,
            variableType: variableMap.type,
            values: [Number(value[0].code)],
            questionGuid: variableMap.QuestionGUID,
            condition: FilterCondition.NumberGreaterThanEqualTo
          });
          if (value.length > 1) {
            collection.addFilter({
              variableName: variable,
              variableType: variableMap.type,
              values: [Number(value[1].code)],
              questionGuid: variableMap.QuestionGUID,
              condition: FilterCondition.NumberLessThanEqualTo
            });
          }
        } else {
          collection.addFilter({
            variableName: variable,
            variableType: variableMap.type,
            values: value.map(val => Number(val.code)),
            questionGuid: variableMap.QuestionGUID,
            condition: FilterCondition.AnyItemSelected
          });
        }
      });

    return this.communicationService.getCollectionOutput(collection);
  }

  private processOutput(output: CollectionOutput) {
    this.chart.showLoader = false;
    const comparison = this.chart.getTimeComparisonProperties();
    const calculationRoundOffStrategy: RoundOff = this.chart.getCalculationRoundOffStrategy();
    if (comparison.isEnabled) {
      let currentOutput: CollectionOutput = new CollectionOutput();
      currentOutput.TableOutput.set(this.chart.Name, output.getFilteredData(this.chart.Name,
        TimePeriod.Variable, TimePeriod.CurrentPeriod));
      currentOutput.Bases.set(this.chart.Name, output.getFilteredBases(this.chart.Name,
        TimePeriod.Variable, TimePeriod.CurrentPeriod));
      currentOutput.EffectiveBases.set(this.chart.Name, output.getFilteredEffectiveBases(this.chart.Name,
        TimePeriod.Variable, TimePeriod.CurrentPeriod));

      let previousOutput: CollectionOutput = new CollectionOutput();
      previousOutput.TableOutput.set(this.chart.Name, output.getFilteredData(this.chart.Name,
        TimePeriod.Variable, TimePeriod.PreviousPeriod));
      previousOutput.Bases.set(this.chart.Name, output.getFilteredBases(this.chart.Name,
        TimePeriod.Variable, TimePeriod.PreviousPeriod));
      previousOutput.EffectiveBases.set(this.chart.Name, output.getFilteredEffectiveBases(this.chart.Name,
        TimePeriod.Variable, TimePeriod.PreviousPeriod));

      currentOutput = this.chart.onDataFetch(currentOutput);
      currentOutput.roundOffAfterCalculation(calculationRoundOffStrategy.type, calculationRoundOffStrategy.decimal);
      previousOutput = this.chart.onDataFetch(previousOutput);
      previousOutput.roundOffAfterCalculation(calculationRoundOffStrategy.type, calculationRoundOffStrategy.decimal);
      currentOutput.calculateComparisonByTimePeriod(currentOutput.TableOutput.get(this.chart.Name),
        previousOutput.TableOutput.get(this.chart.Name), comparison.roundOffStrategy, comparison.decimalPlaces);

      output.filterDataBy(this.chart.Name, TimePeriod.Variable, TimePeriod.CurrentPeriod.toString());
      output.TableOutput.set(this.chart.Name, currentOutput.TableOutput.get(this.chart.Name));
      output.EffectiveBases.set(this.chart.Name, currentOutput.EffectiveBases.get(this.chart.Name));
      output.Bases.set(this.chart.Name, currentOutput.Bases.get(this.chart.Name));
      output.TableOutput.get(this.chart.Name).forEach(value => {
        if (output.Significant.has(value.SigKey)) {
          if (value.Difference > 0) {
            value.SignificanceSign = 1;
          } else if (value.Difference < 0) {
            value.SignificanceSign = -1;
          } else {
            value.SignificanceSign = 0;
          }
        }
      });
    } else {
      output = this.chart.onDataFetch(output);
      output.roundOffAfterCalculation(calculationRoundOffStrategy.type, calculationRoundOffStrategy.decimal);
    }
    const tableOutput = output.TableOutput.get(this.chart.Name);

    if (this.chart.AnalysisType !== AnalysisType.Regression) {
      this.nodata = tableOutput === undefined || tableOutput.length === 0;
    } else {
      this.nodata = false;
    }

    const chartData = DataTransformer.getChartData(this.chart.Type, this.provider, tableOutput);
    this.chartConfig = ChartConfiguration.createChartConfig(this.chart.Type, this.provider, chartData, this.chart.Name);
    switch (this.chart.Type) {
      case ChartTypes.BarChart:
        break;
      case ChartTypes.HorizontalBar:
        break;
      case ChartTypes.Pie:
        break;
      case ChartTypes.Ring:
        break;
      case ChartTypes.KPI:
        break;
      case ChartTypes.Table:
      case ChartTypes.Profile:
        const rowColumn = this.chart.getRowColumn();
        let tableData: DataTable;
        if (this.chart.isTableTransposed()) {
          tableData = DataTransformer.convertToDataTable(
            this.chart.Name,
            output,
            rowColumn[1],
            rowColumn[0]
          );
        } else {
          tableData = DataTransformer.convertToDataTable(
            this.chart.Name,
            output,
            rowColumn[0],
            rowColumn[1]
          );
        }
        this.chart.onTableDataReady(tableOutput, tableData, output.RawData);
        break;
    }
    if (this.chart.Type !== ChartTypes.Table && this.chart.Type !== ChartTypes.Profile) {
      this.chartConfig = this.chart.onConfigReady(
        tableOutput,
        this.chartConfig,
        output.RawData
      );
      setTimeout(() => {
        this.chartSubject.next(this.chartConfig);
      }, 10);
    }
  }

  onNodeClicked(node: any) {
    this.chart.onNodeClick(this.chart);
  }

  onChartClicked(node: any) {
    this.chart.onChartClick(this.chart);
  }

  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }
}
