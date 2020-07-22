export class FilterOption {
  text: string;
  code: string;
  child: FilterOption[];
  isSelected?: boolean;
  isHidden?: boolean;
  isRemoveBoth?:boolean; //if true then apply to remove both chip set of numaric value

  constructor() {
    this.child = new Array<FilterOption>();
  }
}
