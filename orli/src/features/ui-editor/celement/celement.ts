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
    x: number,
    y: number,
    width: CElementDimension,
    height: CElementDimension,
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
