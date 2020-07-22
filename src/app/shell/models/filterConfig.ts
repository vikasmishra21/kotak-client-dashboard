import {FilterDataSource} from '../enums/filter-data-source';
import {FilterType} from '../enums/filter-type';
import { VariableType } from '../enums/variable-type';

export class FilterConfig {
  actAs: FilterType;
  variable: string;
  type: VariableType;
  visibility: boolean;
  isNested: boolean;
  isMultiSelected?: boolean;
  variableText?: string;
  placeHolder?: string;
  dataSource?: FilterDataSource;
  dataFilePath?: string;
  default: string[];
  maxSelectionLimit?: number;
  minSelectionLimit?: number;
  enableSubmitButton?: boolean;
  hideOptions?: string[];
  hasTimeComparison?: boolean;
  exclusivityWith?: string[];
  removeBoth?:boolean; //to check want to delete Numaric value chip set 
  icon?: string;
  iconColor?: string;
}
