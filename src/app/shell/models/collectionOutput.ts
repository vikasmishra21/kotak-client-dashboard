import { TableOutput } from '../interfaces/table-output';
import { RoundOffStrategy } from '../enums/round.off.strategy';

export class CollectionOutput {
  Bases: Map<string, Array<TableOutput>>;
  EffectiveBases: Map<string, Array<TableOutput>>;
  TableOutput: Map<string, Array<TableOutput>>;
  Significant: Map<string, Array<string>>;
  RawData: any;

  constructor() {
    this.Bases = new Map<string, Array<TableOutput>>();
    this.EffectiveBases = new Map<string, Array<TableOutput>>();
    this.TableOutput = new Map<string, Array<TableOutput>>();
    this.Significant = new Map<string, Array<string>>();
  }

  getBase(category: string) {
    this.Bases.get(category);
  }

  filterDataBy(chart: string, variable: string, code: string) {
    this.TableOutput.set(chart, this.getFilteredData(chart, variable, parseInt(code, 10)));
    this.EffectiveBases.set(chart, this.getFilteredEffectiveBases(chart, variable, parseInt(code, 10)));
    this.Bases.set(chart, this.getFilteredBases(chart, variable, parseInt(code, 10)));
  }

  calculateComparisonByTimePeriod(currentData: Array<TableOutput>, previousData: Array<TableOutput>,
    roundOffStrategy: RoundOffStrategy, precision: number) {

    if (previousData.length === currentData.length) {
      currentData.forEach((value, index) => {
        const previousScore = previousData[index].Score;
        const currentScore = currentData[index].Score;
        switch (roundOffStrategy) {
          case RoundOffStrategy.AfterDifference:
            value.Difference = parseFloat((currentScore - previousScore).toFixed(precision));
            break;
          case RoundOffStrategy.BeforeDifference:
            value.Difference = (isNaN(currentScore) ? currentScore : parseFloat(currentScore.toFixed(precision))) -
              (isNaN(previousScore) ? previousScore : parseFloat(previousScore.toFixed(precision)));
            break;
          default:
            value.Difference = currentScore - previousScore;
            break;
        }
      });
    }
  }

  roundOffAfterCalculation(strategy: RoundOffStrategy, decimal: number) {
    if (strategy === RoundOffStrategy.AfterCalculation) {
      this.TableOutput.forEach((row, key) => {
        this.TableOutput.get(key).forEach((tableOutput, index) => {
          if (!isNaN(tableOutput.Score)) {
            tableOutput.Score = parseFloat(parseFloat(tableOutput.Score.toString()).toFixed(decimal));
          }
        });
      });
    }
  }

  getFilteredData(chart: string, variable: string, code: number) {
    const key = `${variable}:${code}`;
    const key2 = `${variable}>${code}`;
    return this.TableOutput.get(chart).filter((element, index) => {
      return element.NestedCategoryMap.indexOf(key) > -1 || element.NestedCategoryMap.indexOf(key2) > -1;
    });
  }

  getFilteredBases(chart: string, variable: string, code: number) {
    const key = `${variable}:${code}`;
    const key2 = `${variable}>${code}`;
    return this.Bases.get(chart).filter((element, index) => {
      return element.NestedCategoryMap.indexOf(key) > -1 || element.NestedCategoryMap.indexOf(key2) > -1;
    });
  }

  getFilteredEffectiveBases(chart: string, variable: string, code: number) {
    const key = `${variable}:${code}`;
    const key2 = `${variable}>${code}`;
    return this.EffectiveBases.get(chart).filter((element, index) => {
      return element.NestedCategoryMap.indexOf(key) > -1 || element.NestedCategoryMap.indexOf(key2) > -1;
    });
  }
}
