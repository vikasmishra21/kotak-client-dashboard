import {FilterOption} from '../models/filterOption';
import {FilterCascadeOutput} from './filter-cascade-output';

export interface JObject {
  getFilteredData(values: any[]): FilterCascadeOutput;
}
