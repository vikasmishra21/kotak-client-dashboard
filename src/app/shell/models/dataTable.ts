export class DataTable {
  rows: Map<string, Array<number>>;
  headers: Array<string>;
  comparisonRows: Map<string, Array<number>>;
  significance: Map<string, Array<number>>;
  bases: Map<string, Array<number>>;

  constructor() {
    this.rows = new Map<string, Array<number>>();
    this.comparisonRows = new Map<string, Array<number>>();
    this.significance = new Map<string, Array<number>>();
    this.headers = new Array<string>();
    this.bases = new Map<string, Array<number>>();
  }

  setRow(rowName: string, item: number) {
    if (!this.rows.has(rowName)) {
      this.rows.set(rowName, new Array<number>());
    }
    this.rows.get(rowName).push(item);
  }

  setComparisonRows(rowName: string, item: number) {
    if (!this.comparisonRows.has(rowName)) {
      this.comparisonRows.set(rowName, new Array<number>());
    }
    this.comparisonRows.get(rowName).push(item);
  }

  setSignificanceSign(rowName: string, item: number) {
    if (!this.significance.has(rowName)) {
      this.significance.set(rowName, new Array<number>());
    }
    this.significance.get(rowName).push(item);
  }

  addHeader(header) {
    if (this.headers.indexOf(header) === -1) {
      this.headers.push(header);
    }
  }

  setBaseRow(rowName: string, item: number) {
    if (!this.bases.has(rowName)) {
      this.bases.set(rowName, new Array<number>());
    }
    this.bases.get(rowName).push(item);
  }
}
