import {
  CElementLayoutAlign,
  CElementLayoutAlignUpdate,
} from "./celement-layout";
import { CElementMargin, CElementMargins } from "./celement-margin";

export class CElement {
  public layoutAlign = new CElementLayoutAlign();

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: CElementDimension,
    public height: CElementDimension,
    public margins: CElementMargins,
  ) {}
}

export class CElementTransformation {
  constructor(
    public x?: number,
    public y?: number,
    public width?: CElementDimension,
    public height?: CElementDimension,
    public margins?: CElementMargin[],
    public align?: CElementLayoutAlignUpdate
  ) {}

  public isEmpty = () =>
    !this.x && !this.y && !this.width && !this.height && !this.align && !this.margins;
}

export enum CElementDimensionMeasurement {
  Px = 1,
  Percent = 2,
}

export enum CElementDimensionAxis {
  Width = 1 << 1,
  Height = 2 << 2,
}

export class CElementDimension {  
  constructor(
    public value: number,
    public measurement: CElementDimensionMeasurement = CElementDimensionMeasurement.Px
  ) {    
  }
}
