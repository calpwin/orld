export enum CElementMarginDirection {
  Top = 1,
  Right = 2,
  Bottom = 3,
  Left = 4,
}

export class CElementMargin {
  constructor(
    public value: number,
    public direction: CElementMarginDirection
  ) {}

  get isSet() {
    return this.value > 0;
  }
}

/** All direction CElement margins */
export class CElementMargins {
  public top!: CElementMargin;
  public right!: CElementMargin;
  public bottom!: CElementMargin;
  public left!: CElementMargin;

  constructor();
  constructor(top: CElementMargin);
  constructor(top: CElementMargin, right: CElementMargin);
  constructor(
    top: CElementMargin,
    right: CElementMargin,
    bottom: CElementMargin
  );
  constructor(
    top: CElementMargin,
    right: CElementMargin,
    bottom: CElementMargin,
    left: CElementMargin
  );
  constructor(
    top?: CElementMargin,
    right?: CElementMargin,
    bottom?: CElementMargin,
    left?: CElementMargin
  ) {
    this.top = top ?? new CElementMargin(0, CElementMarginDirection.Top);
    this.right = right ?? new CElementMargin(0, CElementMarginDirection.Right);
    this.bottom =
      bottom ?? new CElementMargin(0, CElementMarginDirection.Bottom);
    this.left = left ?? new CElementMargin(0, CElementMarginDirection.Left);
  }

  set(margin: CElementMargin) {
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
