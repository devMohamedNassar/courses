export enum FilterOperator {
  equal,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual
}

export class FilterConfig {
  constructor(
    public filterBy: string,
    public filterValue: string | number,
    public operator: FilterOperator){}
}

export type Filter = FilterConfig[];