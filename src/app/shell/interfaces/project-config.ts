import {TreeType} from '../enums/tree.type';

export interface ProjectConfig {
  ProjectID: string;
  ProjectName: string;
  DashboardName: string;
  DashboardID: string;
  Subscription: string;
  HostPath: string;
  version: string;
  TreeTypes: TreeType[];
}
