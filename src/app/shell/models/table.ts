import { Filter } from './filter';
import { Break } from './break';
import { BasicUtil } from '../util/basicUtil';
import { AnalysisType } from '../enums/analysis-type';

export class Table {
  ID: string;
  private OwnerID: string;
  private DefinitionType: 1;
  private ExcludeInOuput: false;
  private Weight: string;
  private WeightQuestionGuid: string;
  private StaticFilter: Filter;
  private DynamicFilter: Filter;
  private IsTranspose: boolean;
  private DependentTable: string;
  private DefaultView = 1;
  private MetadataProperties: {};
  private Properties: {};
  private SideBreak: Break[];
  private TopBreak: Break[];
  private ComputedAxis: null;
  private DecimalPlace = 0;
  private AnalysisType = 18;
  ShowAllSeries: boolean;
  ShowOverall: boolean;
  private RegressionType: number;
  Pagesize: number;
  Pageoffset: number;

  constructor(id?: string, owner?: string) {
    this.ID = id || BasicUtil.newGuid();
    this.OwnerID = owner || '';
    this.StaticFilter = new Filter();
    this.DynamicFilter = new Filter();
    this.TopBreak = new Array<Break>();
    this.SideBreak = new Array<Break>();
  }

  setAnalysisType(type: AnalysisType) {
    this.AnalysisType = type;
  }

  addSideBreak(sideBreak: Break) {
    this.SideBreak.push(sideBreak);
  }

  addTopBreak(topBreak: Break) {
    this.TopBreak.push(topBreak);
  }

  setRegressionType(type: number) {
    this.RegressionType = type;
  }
}
