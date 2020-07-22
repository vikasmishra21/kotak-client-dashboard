import {FilterRule} from './filter.rule';

export class FilterGroup {
  Operator: string;
  rules: Array<FilterRule>;

  constructor() {
    this.Operator = 'AND';
    this.rules = new Array<FilterRule>();
  }
}
