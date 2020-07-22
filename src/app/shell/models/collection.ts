import { Filter } from './filter';
import { Table } from './table';
import { FilterRule } from './filter.rule';
import { FilterRuleConfig } from '../interfaces/filter-rule-config';
import { BasicUtil } from '../util/basicUtil';
import { AnalysisType } from '../enums/analysis-type';

export class Collection {
  ID: string;
  Name: string;
  public usecache: boolean;
  private Filter: Filter;
  private IsCommentsEnabled: boolean;
  private MetadataProperties: object;
  private Weight: string;
  private WeightQuestionGuid: string;
  private Language: string;
  private Filters: object;
  private TopAxis: object;
  private SideAxis: object;
  private CollectionSharing: object;
  private QuickList: object;
  private Variables: [];
  private Children: object;
  private AnalysisType: AnalysisType;
  private Tables: Table[];
  private ShowEffectiveBase: boolean;
  private IsSigTest: boolean;

  constructor(name: string, weight?: string) {
    this.ID = BasicUtil.newGuid();
    this.Name = name;
    this.Filter = new Filter();
    this.Tables = new Array<Table>();
    this.ShowEffectiveBase = false;
    this.Weight = weight || '';
    this.usecache = true;
  }

  addTable(table: Table) {
    this.Tables.push(table);
  }

  setAnalysisType(type: AnalysisType) {
    this.AnalysisType = type;
  }

  getAnalysisType(): AnalysisType {
    return this.AnalysisType;
  }

  addFilter(config: FilterRuleConfig, treeType?: number) {
    const rule = new FilterRule(config, treeType);
    this.Filter.group.rules.push(rule);
  }

  enableSigTest() {
    this.IsSigTest = true;
  }
}
