export enum CElementMarginDirection {
  Top = 1,
  Right = 2,
  Bottom = 3,
  Left = 4,
}

export class CElementIndent {
  constructor(
    public value: number,
    public direction: CElementMarginDirection
  ) {}

  get isSet() {
    return this.value > 0;
  }
}

/** All direction CElement margins */
export class CElementIndents {
  public top!: CElementIndent;
  public right!: CElementIndent;
  public bottom!: CElementIndent;
  public left!: CElementIndent;

  constructor();
  constructor(top: CElementIndent);
  constructor(top: CElementIndent, right: CElementIndent);
  constructor(
    top: CElementIndent,
    right: CElementIndent,
    bottom: CElementIndent
  );
  constructor(
    top: CElementIndent,
    right: CElementIndent,
    bottom: CElementIndent,
    left: CElementIndent
  );
  constructor(
    top?: CElementIndent,
    right?: CElementIndent,
    bottom?: CElementIndent,
    left?: CElementIndent
  ) {
    this.top = top ?? new CElementIndent(0, CElementMarginDirection.Top);
    this.right = right ?? new CElementIndent(0, CElementMarginDirection.Right);
    this.bottom =
      bottom ?? new CElementIndent(0, CElementMarginDirection.Bottom);
    this.left = left ?? new CElementIndent(0, CElementMarginDirection.Left);
  }

  set(margin: CElementIndent) {
    switch (margin.direction) {
      case CElementMarginDirection.Top:
        this.top = margin;
        break;
      case CElementMarginDirection.Right:
        this.right = margin;
        break;
      case CElementMarginDirection.Bottom:
        this.bottom = margin;
        break;
      case CElementMarginDirection.Left:
        this.left = margin;
        break;
      default:
        throw Error(`Margin ${margin.direction} not supported`);
    }
  }
}
