import {FilterRuleConfig} from '../interfaces/filter-rule-config';
import {FilterCondition} from '../enums/filter-condition.enum';
import {VariableType} from '../enums/variable-type';

export class FilterRule {
  questionGUID: string;
  condition: string;
  variablename: string;
  TreeType: number;
  variabletype: VariableType;
  data: string;
  group: any = null;
  variable: any = null;
  variableList: any = null;
  QuestionType: string;
  subfield: string;
  iteration: undefined;

  constructor(config: FilterRuleConfig, treeType?: number) {
    this.QuestionType = '';
    this.subfield = '';
    this.questionGUID = config.questionGuid;
    this.data = config.values.join(',');
    this.variablename = config.variableName;
    this.variabletype = config.variableType;
    this.TreeType = treeType || 2;
    this.condition = config.condition || FilterCondition.AnyItemSelected;
  }

}
