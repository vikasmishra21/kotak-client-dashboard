import {Injectable} from '@angular/core';
import {CacheTypes} from '../enums/cache.types';
import {FilterCascadeOutput} from '../interfaces/filter-cascade-output';
import {BasicUtil} from './basicUtil';

@Injectable()
export class FilterCaching {
  private static filterData: Map<string, FilterCascadeOutput> = new Map<string, FilterCascadeOutput>();

  static cacheData(variable: string, output: FilterCascadeOutput, cacheType: CacheTypes) {
    if (cacheType === CacheTypes.InMemory) {
      this.filterData.set(variable, BasicUtil.deepCopy(output));
    }
  }

  static isCached(variable: string): boolean {
    return this.filterData.has(variable);
  }

  static getCachedData(variable: string): FilterCascadeOutput {
    return this.filterData.get(variable);
  }
}
