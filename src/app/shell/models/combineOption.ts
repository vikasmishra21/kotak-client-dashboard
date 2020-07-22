export class CombineOption {
  ID: number;
  Name: string;
  Collapse: boolean;
  Options: Array<number>;

  constructor(options) {
    this.Options = options;
    this.Collapse = true;
  }

}
