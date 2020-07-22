import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { Chart, ChartFilter } from '../models/chart';
import { Break } from '../models/break';
import { Table } from '../models/table';
import { VariableMap } from '../interfaces/variable-map';
import { Measure } from '../enums/measure';
import { VariableType } from '../enums/variable-type';
import { AnalysisType } from '../enums/analysis-type';
import { ChartTypes } from '../enums/chart.types';

@Injectable()
export class CollectionUtil {
  private static VARIABLE_MAP: Map<string, VariableMap> = new Map<string, VariableMap>();

  static setVariableMap(map) {
    this.VARIABLE_MAP = new Map<string, VariableMap>();
    for (const i in map) {
      if (map.hasOwnProperty(i)) {
        delete map[i].variableText;
        this.VARIABLE_MAP.set(i, map[i]);
      }
    }
  }

  static getVariableMap(variable): VariableMap {
    const map: VariableMap = Object.assign({}, this.VARIABLE_MAP.get(variable.split('.')[0]));
    map.SelectedVariable = variable;
    return map;
  }

  static populateVariableMap(map): Map<string, VariableMap> {
    this.flattenVariables(map);
    return this.VARIABLE_MAP;
  }

  static hasVariableMap() {
    return this.VARIABLE_MAP.size > 0;
  }

  static createCollection(chart: Chart): Collection {
    const collection: Collection = new Collection(chart.Name, chart.getCollectionWeight());
    if (chart.isSigTestEnabled()) {
      collection.enableSigTest();
    }

    if (chart.UseCache === false) {
      collection.usecache = false;
    }

    const table: Table = this.createTable(chart, chart.Name);
    const analysisType: AnalysisType = this.getAnalysisType(chart);
    if (analysisType === AnalysisType.ProfileTable) {
      collection.setAnalysisType(analysisType);
      table.setAnalysisType(analysisType);
    }
    chart.getCollectionFilters().map(filter => {
      collection.addFilter({
        variableName: filter.variable,
        variableType: this.getVariableMap(filter.variable).type,
        values: filter.data,
        questionGuid: this.getVariableMap(filter.variable).QuestionGUID,
        condition: filter.condition
      });
    });
    collection.addTable(table);
    return collection;
  }

  private static getAnalysisType(chart: Chart): AnalysisType {
    const variableMap = this.getVariableMap(chart.SideBreak[0]);

    if (chart.Type === ChartTypes.Profile) {
      return AnalysisType.ProfileTable;
    } else if (variableMap.type === VariableType.Text) {
      return AnalysisType.ProfileTable;
    }
  }

  static createTable(chart: Chart, tableID?: string): Table {
    const table = new Table(tableID);
    chart.SideBreak.map((variable: string, index: number) => {
      const sideBreak = this.getSideBreak(chart, variable, index);

      if (chart.AnalysisType === AnalysisType.Regression) {
        sideBreak.isDependentVariable(true);
      }

      this.addSideBreakNesting(sideBreak, chart, index.toString());
      table.addSideBreak(sideBreak);
    });

    if (chart.IndependentVariables) {
      chart.IndependentVariables.forEach((variable: string, index: number) => {
        const sideBreak = this.getSideBreak(chart, variable, index);
        this.addSideBreakNesting(sideBreak, chart, index.toString());


        sideBreak.setContinousVariable(chart.IsContinousVariable === false ? false : true);

        table.addSideBreak(sideBreak);
      });
    }

    chart.TopBreak.map((variable: string, index: number) => {
      const topBreak = this.getTopBreak(chart, variable, index);
      this.addTopBreakNesting(topBreak, chart, index.toString());
      table.addTopBreak(topBreak);
    });

    if (chart.AnalysisType) {
      table.setAnalysisType(chart.AnalysisType);
      table.setRegressionType(chart.RegressionType);
    }

    table.ShowOverall = chart.getShowOverall();
    table.ShowAllSeries = chart.getShowAllSeries();
    const pageDetail = chart.getDataPagination();
    table.Pagesize = pageDetail.pageSize;
    table.Pageoffset = pageDetail.pageoffset;

    return table;
  }

  private static getSideBreak(chart: Chart, variable: string, index: number, nestKey?: string): Break {
    const variableMap = this.getVariableMap(variable);
    const sideBreak = new Break(variableMap, chart.Measure);
    sideBreak.showOptions(chart.getSideBreakShownOptions(index, nestKey));
    sideBreak.showBase(chart.isSideBreakBaseShown(index, nestKey));
    sideBreak.showUnweightedBase(chart.isSideBreakUnWeightedBaseShown(index, nestKey));
    sideBreak.setUnweightedBaseMeasure(chart.getSideBreakUnWeightedBaseMeasure(index, nestKey));
    sideBreak.showTotal(chart.isSideBreakTotalShown(index, nestKey));
    sideBreak.hideOptions(chart.getSideBreakHiddenOptions(index, nestKey));
    sideBreak.includeNotAnswered(chart.isNoAnswerIncluded());
    sideBreak.addCombinedOption(chart.getSideBreakCombinedOptions(variable), chart.getSideBreakCombinedNames(variable));
    const filters = chart.getSideBreakFilter(index);
    filters.map((filter: ChartFilter) => {
      sideBreak.addFilterRule({
        variableName: filter.variable,
        variableType: this.getVariableMap(filter.variable).type,
        values: filter.data,
        questionGuid: this.getVariableMap(filter.variable).QuestionGUID,
        condition: filter.condition
      });
    });
    return sideBreak;
  }

  private static getTopBreak(chart: Chart, variable: string, index: number, nestKey?: string): Break {
    const variableMap = this.getVariableMap(variable);
    const topBreak = new Break(variableMap, Measure.ColumnPercent);
    topBreak.showOptions(chart.getTopBreakShownOptions(index, nestKey));
    topBreak.showBase(chart.isTopBreakBaseShown(index, nestKey));
    topBreak.showUnweightedBase(chart.isTopBreakUnWeightedBaseShown(index, nestKey));
    topBreak.setUnweightedBaseMeasure(chart.getTopBreakUnWeightedBaseMeasure(index, nestKey));
    topBreak.showTotal(chart.isTopBreakTotalShown(index, nestKey));
    topBreak.hideOptions(chart.getTopBreakHiddenOptions(index, nestKey));
    topBreak.includeNotAnswered(chart.isNoAnswerIncluded());
    topBreak.addCombinedOption(chart.getTopBreakCombinedOptions(variable), chart.getTopBreakCombinedNames((variable)));
    const filters = chart.getTopBreakFilter(index);
    filters.map((filter: ChartFilter) => {
      topBreak.addFilterRule({
        variableName: filter.variable,
        variableType: this.getVariableMap(filter.variable).type,
        values: filter.data,
        questionGuid: this.getVariableMap(filter.variable).QuestionGUID,
        condition: filter.condition
      });
    });
    return topBreak;
  }

  private static addSideBreakNesting(cBreak: Break, chart: Chart, nestKey?: string) {
    chart.getSideBreakNest(nestKey).map((n, index) => {
      const nBreak = this.getSideBreak(chart, n, index, nestKey);
      this.addSideBreakNesting(nBreak, chart, index + '>' + nestKey);
      cBreak.addNestBreak(nBreak);
    });
  }

  private static addTopBreakNesting(cBreak: Break, chart: Chart, nestKey?: string) {
    chart.getTopBreakNest(nestKey).map((n, index) => {
      const nBreak = this.getTopBreak(chart, n, index, nestKey);
      this.addTopBreakNesting(nBreak, chart, index + '>' + nestKey);
      cBreak.addNestBreak(nBreak);
    });
  }

  private static flattenVariables(treeNode) {
    treeNode.map(d => {
      if (d.SurveyObjectType === 10 && !this.VARIABLE_MAP.has(d.SurveyObjectName)) {
        this.VARIABLE_MAP.set(d.SurveyObjectName, {
          type: d.SurveyObjectSubType,
          QuestionGUID: d.Properties.QuestionGUID,
          SelectedVariableGUID: d.SurveyObjectID,
          SelectedVariable: d.SurveyObjectName,
        });
      }
      if (d.Children.length > 0) {
        this.flattenVariables(d.Children);
      }
    });
  }
}
