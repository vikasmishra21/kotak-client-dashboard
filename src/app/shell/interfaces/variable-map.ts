import {VariableType} from '../enums/variable-type';

export interface VariableMap {
  type: VariableType;
  QuestionGUID: string;
  SelectedVariable: string;
  SelectedVariableGUID: string;
}
