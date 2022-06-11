import {
  CElementLayoutAlign,
  CElementLayoutAlignUpdate,
} from "./celement-layout";

export class CElement {
  public layoutAlign = new CElementLayoutAlign();

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: CElementDimension,
    public height: CElementDimension
  ) {}
}

export class CElementTransformation {
  constructor(
    public x?: number,
    public y?: number,
    public width?: CElementDimension,
    public height?: CElementDimension,
    public align?: CElementLayoutAlignUpdate
  ) {}

  public isEmpty = () =>
    !this.x && !this.y && !this.width && !this.height && !this.align;
}

export enum CElementDimensionMeasurement {
  Px = 1,
  Percent = 2,
}

export enum CElementDimensionAxis {
  Width = 1,
  Height = 2,
}

export class CElementDimension {  
  constructor(
    public value: number,
    public measurement: CElementDimensionMeasurement = CElementDimensionMeasurement.Px
  ) {    
  }
}
