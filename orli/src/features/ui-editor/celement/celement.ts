import {
  CElementLayoutAlign,
  CElementLayoutAlignUpdate,
} from "./celement-layout";
import { CElementIndent, CElementIndents } from "./celement-margin";

export class CElementToCreate {
  public layoutAlign = new CElementLayoutAlign();

  public margins!: CElementIndents;
  public paddings!: CElementIndents;

  constructor(
    public x: CElementDimension<CElementDimensionExtendMeasurement>,
    public y: number,
    public width: CElementDimension<CElementDimensionExtendMeasurement>,
    public height: CElementDimension<CElementDimensionMeasurement>,
    margins?: CElementIndents,
    paddings?: CElementIndents,
    public id?: string
  ) {
    this.margins = margins ?? new CElementIndents();
    this.paddings = paddings ?? new CElementIndents();
  }
}

export class CElement extends CElementToCreate {
  public static RootCelId = "root-cel";

  public parentCelId?: string;
  public childrenCelIds: string[] = [];

  /** Root cel container for other cels */
  static isRoot(cel: CElement) {
    return cel.id === CElement.RootCelId;
  }

  constructor(
    public id: string,
    x: CElementDimension<CElementDimensionExtendMeasurement>,
    y: number,
    width: CElementDimension<CElementDimensionExtendMeasurement>,
    height: CElementDimension<CElementDimensionMeasurement>,
    margins: CElementIndents,
    paddings: CElementIndents
  ) {
    super(x, y, width, height, margins, paddings);
  }

  static createFromCelToCreate(celToCreate: CElementToCreate, id: string, parentCelId?:string) {
    const cel = new CElement(
      id,
      celToCreate.x,
      celToCreate.y,
      celToCreate.width,
      celToCreate.height,
      celToCreate.margins,
      celToCreate.paddings
    );
    cel.layoutAlign = celToCreate.layoutAlign ?? new CElementLayoutAlign();
    cel.parentCelId = parentCelId;

    return cel;
  }
}

export class CElementTransformation {
  constructor(
    public x?: CElementDimension<CElementDimensionExtendMeasurement>,
    public y?: number,
    public width?: CElementDimension<CElementDimensionExtendMeasurement>,
    public height?: CElementDimension<CElementDimensionMeasurement>,
    public margins?: CElementIndent[],
    public paddings?: CElementIndent[],
    public align?: CElementLayoutAlignUpdate
  ) {}

  public isEmpty = () =>
    !this.x &&
    !this.y &&
    !this.width &&
    !this.height &&
    !this.align &&
    !this.margins &&
    !this.paddings;
}

export enum CElementDimensionMeasurement {
  Px = 1,
  Percent = 2,
}

export enum CElementLayoutGridDimensionMeasurement {
  LayoutGrid = 10
}

export type CElementDimensionExtendMeasurement = CElementDimensionMeasurement | CElementLayoutGridDimensionMeasurement;

export enum CElementDimensionAxis {
  Width = 1 << 1,
  Height = 2 << 2,
}

export enum CElementPositionAxis {
  X = 1 << 1,
  Y = 2 << 2,
}

export class CElementDimension<TMeasurement extends CElementDimensionMeasurement | CElementDimensionExtendMeasurement> {
  constructor(
    public value: number,
    public measurement: TMeasurement = <TMeasurement><any>CElementDimensionMeasurement.Px
  ) {              
  }
}
