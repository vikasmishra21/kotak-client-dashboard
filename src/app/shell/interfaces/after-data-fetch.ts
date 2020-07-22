import { CollectionOutput } from '../models/collectionOutput';
import { TableOutput } from './table-output';
import { DataTable } from '../models/dataTable';
import { ChartProviderConfiguration } from "./chart-provider-configuration";

export type AfterDataFetch = (output: CollectionOutput) => CollectionOutput;

export type AfterConfigReady = (output: TableOutput[], config: ChartProviderConfiguration, rawData: any) => ChartProviderConfiguration;

export type AfterTableDataReady = (output: TableOutput[], dataTable: DataTable, rawData: any) => void;

export type AfterNodeClick = (node: any) => void;
export type AfterChartClick = (chart: any) => void;

export type AfterSessionExpired = () => void;

