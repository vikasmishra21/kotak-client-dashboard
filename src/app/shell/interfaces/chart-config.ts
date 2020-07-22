import { ChartTypes } from '../enums/chart.types';
import { Measure } from '../enums/measure';
import { AnalysisType } from '../enums/analysis-type';

export interface ChartConfig {
  SideBreak: string[];
  TopBreak: string[];
  Type: ChartTypes;
  Measure: Measure;
  IndependentVariables?: string[],
  AnalysisType?: AnalysisType,
  RegressionType?: number,
  UseCache?: boolean,
  IsContinousVariable?: boolean;
  ExcludeFilters?: string[];
}
