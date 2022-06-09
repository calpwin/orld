import { CElementLayoutAlign, CElementLayoutAlignUpdate } from "./celement-layout";

export class CElement {
  public layoutAlign = new CElementLayoutAlign();

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}

export class CElementTransformation {
  constructor(
    public x?: number,
    public y?: number,
    public width?: number,
    public height?: number,
    public align?: CElementLayoutAlignUpdate
  ) {}

  public isEmpty = () => !this.x && !this.y && !this.width && !this.height && !this.align;
}
