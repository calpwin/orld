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
    public x: number,
    public y: number,
    public width: CElementDimension,
    public height: CElementDimension,
    margins?: CElementIndents,
    paddings?: CElementIndents
  ) {
    this.margins = margins ?? new CElementIndents();
    this.paddings = paddings ?? new CElementIndents();
  }
}

export class CElement extends CElementToCreate {
  public static RootCelId = 'root-cel';

  public parentCelId?: string;
  public childrenCelIds: string[] = [];

  /** Root cel container for other cels */
  get isRoot() {
    return this.id === CElement.RootCelId;
  }

  constructor(
    public id: string,
    x: number,
    y: number,
    width: CElementDimension,
    height: CElementDimension,
    margins: CElementIndents,
    paddings: CElementIndents
  ) {
    super(x, y, width, height, margins, paddings);
  }

  static createFromCel(cel: CElement) {
    const newCel = new CElement(cel.id, cel.x, cel.y, cel.width, cel.height, cel.margins, cel.paddings);
    newCel.parentCelId = cel.parentCelId;
    newCel.childrenCelIds = cel.childrenCelIds;

    return newCel;
  }
}

export class CElementTransformation {
  constructor(
    public x?: number,
    public y?: number,
    public width?: CElementDimension,
    public height?: CElementDimension,
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

export enum CElementDimensionAxis {
  Width = 1 << 1,
  Height = 2 << 2,
}

export class CElementDimension {
  constructor(
    public value: number,
    public measurement: CElementDimensionMeasurement = CElementDimensionMeasurement.Px
  ) {}
}
