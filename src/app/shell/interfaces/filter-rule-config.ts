import {VariableType} from '../enums/variable-type';
import {FilterCondition} from '../enums/filter-condition.enum';

export interface FilterRuleConfig {
  variableName: string;
  variableType: VariableType;
  values: any[];
  questionGuid: string;
  condition: FilterCondition;
}
