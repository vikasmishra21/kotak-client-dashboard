import {Injectable} from '@angular/core';
import {TableOutput} from '../interfaces/table-output';
import {DataTable} from '../models/dataTable';
import {CollectionOutput} from '../models/collectionOutput';
import {ChartTypes} from '../enums/chart.types';
import {ChartProvider} from '../enums/chart.provider';
import {DataTransformable} from '../interfaces/data-transformable';
import {EChartsData} from './transformables/echarts.data';
import {ZingChartData} from './transformables/zing.chart.data';
import {AnalysisType} from '../enums/analysis-type';

@Injectable()
export class DataTransformer {

  static convertToDataTable(tableName: string, output: CollectionOutput = new CollectionOutput(), rowField?: string,
                            columnField?: string): DataTable {
    const flatData: Array<TableOutput> = output.TableOutput.get(tableName);
    const baseData: Array<TableOutput> = output.Bases.get(tableName);
    const dataTable = new DataTable();
    const rowName = rowField || 'SeriesName';
    const columnName = columnField || 'CategoryName';
    flatData.forEach(data => {
      dataTable.setRow(data[rowName], data.Score);
      dataTable.setComparisonRows(data[rowName], data.Difference);
      dataTable.setSignificanceSign(data[rowName], data.SignificanceSign);
      dataTable.addHeader(data[columnName]);
    });
    baseData.forEach(data => {
      dataTable.setBaseRow(data[rowName], data.Score);
    });
    return dataTable;
  }

  static toFlatTableOutput(table, analysisType?: AnalysisType): Array<TableOutput> {
    let flatData = new Array<TableOutput>();
    const series = [];
    const categories = [];
    const nameMappers = {
      series: {},
      category: {}
    };
    if (!table) {
      return;
    }
    if (!table.properties) {
      table.properties = {};
    }

    if (!table.properties.TableProperties) {
      table.properties.TableProperties = {};
    }
    if (analysisType === AnalysisType.ProfileTable) {
      this.getEndNodes(table.category, categories, 'SubCategory', '', nameMappers.category, table.properties.TableProperties.alias, '');
      flatData = this.getProfileData(categories, table.data);
    } else {
      this.getEndNodes(table.series, series, 'SubSeries', '', nameMappers.series, table.properties.TableProperties.alias, '');
      this.getEndNodes(table.category, categories, 'SubCategory', '', nameMappers.category, table.properties.TableProperties.alias, '');
      series.forEach(row => {
        const node: any = {
          SeriesName: row.Name,
          SeriesCode: row.Code,
          SeriesVariableID: row.VariableID,
          SeriesMap: row.Map,
          SeriesTree: row.Tree,
        };

        if (row.Index != null && !isNaN(row.Index)) {
          categories.forEach((col, index) => {
            const categoryNode = {...node};
            categoryNode.CategoryName = col.Name;
            categoryNode.CategoryCode = col.Code;
            categoryNode.CategoryVariableID = col.VariableID;
            categoryNode.CategoryMap = col.Map;
            categoryNode.CategoryTree = col.Tree;
            categoryNode.NestedCategoryMap = col.NestMap;
            if (col.Index != null && table.data[row.Index] && table.data[row.Index].length > col.Index) {
              categoryNode.Score = table.data[row.Index][col.Index];
              categoryNode.SigKey = row.Index + '-' + col.Index;
            } else {
              categoryNode.Score = NaN;
            }
            flatData.push(categoryNode);
          });
        }
      });
    }

    return flatData;
  }

  static getChartData(type: ChartTypes, provider: ChartProvider, data: Array<TableOutput>): Array<any> {
    const transformer: DataTransformable = this.getDataProvider(provider);
    let transformedData: Array<any> = new Array<any>();
    switch (type) {
      case ChartTypes.KPI:
        transformedData = transformer.toKPI(data);
        break;
      case ChartTypes.Ring:
        transformedData = transformer.toRing(data);
        break;
      case ChartTypes.BarChart:
        transformedData = transformer.toBar(data);
        break;
      case ChartTypes.HorizontalBar:
        transformedData = transformer.toHBar(data);
        break;
      case ChartTypes.Line:
        transformedData = transformer.toLine(data);
        break;
      case ChartTypes.Pie:
        transformedData = transformer.toPie(data);
        break;
      case ChartTypes.Scatter:
        transformedData = transformer.toScatter(data);
        break;
      case ChartTypes.StackedVerticalBar:
        transformedData = transformer.toStackedVerticalBar(data);
        break;
      case ChartTypes.StackedHorizontalBar:
        transformedData = transformer.toStackedHorizontalBar(data);
        break;
      case ChartTypes.MeanChart:
        transformedData = transformer.toMeanChart(data);
        break;
      case ChartTypes.VerticalBar:
        transformedData = transformer.toVBar(data);
        break;
      case ChartTypes.Area:
        transformedData = transformer.toArea(data);
        break;
      case ChartTypes.Bubble:
        transformedData = transformer.toScatter(data);
        // transformedData = {};
        // Currently bubble is same as scatter, fix later
        break;
      case ChartTypes.Gauge:
        transformedData = transformer.toGauge(data);
        break;
        case ChartTypes.Radar:
          transformedData = transformer.toRadar(data);
          break;

    }
    return transformedData;
  }

  private static getDataProvider(provider: ChartProvider): DataTransformable {
    let transformer: DataTransformable;
    switch (provider) {
      case ChartProvider.ZingChart:
        transformer = new ZingChartData();
        break;
      case ChartProvider.ECharts:
        transformer = new EChartsData();
        break;
      case ChartProvider.ChartJS:
        break;
    }
    return transformer;
  }

  private static getEndNodes(objectToIterate, result, childProperty, parent, mapper, alias, nestMap) {
    if (Array.isArray(objectToIterate)) {
      objectToIterate.forEach(item => {
        if (item[childProperty].length > 0) {
          let separator;
          if (item.Code.indexOf('v') > -1) {
            separator = ':';
          } else {
            separator = '>';
          }
          this.getEndNodes(item[childProperty], result, childProperty, parent + item.Text + '>',
            mapper, alias, nestMap + item.Code + separator);
        } else {
          const text = alias && alias.hasOwnProperty(item.Name) ? alias[item.Name] : item.Text;
          if (!mapper.hasOwnProperty(text)) {
            mapper[text] = -1;
          }
          const nest = nestMap + item.Code;
          mapper[text]++;
          result.push({
            Name: text,
            VariableID: item.VariableID,
            Code: item.Code,
            Index: item.Index,
            Tree: parent,
            Map: item.Name,
            Color: item.Color,
            NestMap: nest
          });
        }
      }, this);
    }
  }

  private static getProfileData(categories, data): Array<TableOutput> {
    const node: any = {
      SeriesName: '',
      SeriesCode: '',
      SeriesVariableID: '',
      SeriesMap: '',
      SeriesTree: '',
    };
    const flatData = new Array<TableOutput>();
    data.forEach((row, i) => {
      categories.forEach((col, j) => {
        const categoryNode = {...node};
        categoryNode.CategoryName = col.Name;
        categoryNode.CategoryCode = col.Code;
        categoryNode.CategoryVariableID = col.VariableID;
        categoryNode.CategoryMap = col.Map;
        categoryNode.CategoryTree = col.Tree;
        categoryNode.NestedCategoryMap = col.NestMap;
        categoryNode.Score = data[i][j];
        flatData.push(categoryNode);
      });
    });
    return flatData;
  }
}
