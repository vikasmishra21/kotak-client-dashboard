export function show(index: number, options: number[]) {
  return { show: { [index]: options } };
}

export function hide(index: number, options: number[]) {
  return { hide: { [index]: options } };
}

export function base(index: number, toShow: boolean) {
  return { base: { [index]: toShow } };
}

export function total(index: number, toShow: boolean) {
  return { total: { [index]: toShow } };
}

export function merge(mergeFrom, mergeTo = {}) {
  for (const i in mergeFrom) {
    if (mergeFrom.hasOwnProperty(i)) {
      if (!mergeTo.hasOwnProperty(i)) {
        mergeTo[i] = {};
      }
      for (const y in mergeFrom[i]) {
        if (mergeFrom[i].hasOwnProperty(y)) {
          mergeTo[i][y] = mergeFrom[i][y];
        }
      }
    }
  }
  return mergeTo;
}

export class Nestable {
  private context: any;
  public parenNestKey: string;
  private readonly currentBreak: BreakType;

  constructor(ctx: any, breakType: BreakType) {
    this.context = ctx;
    this.currentBreak = breakType;
    this.parenNestKey = '';
  }

  nest(index: number, variables: string[]): Pipeable {
    this.parenNestKey = this.parenNestKey === '' ? index + '' : this.parenNestKey + '>' + index;
    this.context.getBreakOperation(this.currentBreak).nest[this.parenNestKey] = variables;
    return new Pipeable(this, this.currentBreak, this.parenNestKey);
  }

  getBreakOperation() {
    return this.context.getBreakOperation(this.currentBreak);
  }

  setBreakOperation(breakType, result) {
    return this.context.setBreakOperation(breakType, result);
  }
}

class Pipeable {
  private readonly context: Nestable;
  private readonly parenNestKey: string;
  private readonly currentBreak: BreakType;
  private readonly operationResult: any;

  constructor(ctx: Nestable, breakType: BreakType, key: string) {
    this.context = ctx;
    this.operationResult = {};
    this.currentBreak = breakType;
    this.parenNestKey = key;
  }

  // Pipe operator: Use to pipe multiple operations
  pipe(...operations) {
    operations.map(operation => {
      this.merge(operation, this.operationResult);
    });
    merge(this.context.getBreakOperation(), this.operationResult);
    this.context.setBreakOperation(this.currentBreak, this.operationResult);
    return this.context;
  }

  private merge(mergeFrom, mergeTo) {
    for (const i in mergeFrom) {
      if (mergeFrom.hasOwnProperty(i)) {
        if (!mergeTo.hasOwnProperty(i)) {
          mergeTo[i] = {};
        }
        for (const y in mergeFrom[i]) {
          if (mergeFrom[i].hasOwnProperty(y)) {
            mergeTo[i][this.parenNestKey + '>' + y] = mergeFrom[i][y];
          }
        }
      }
    }
  }
}

export enum BreakType {
  SideBreak = 'SideBreak',
  TopBreak = 'TopBreak'
}
