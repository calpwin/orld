export enum CElementMarginDirection {
    Top = 1,
    Right = 2,
    Bottom = 3,
    Left = 4
}

export class CElementMargin {
    constructor(public value: number, direction: CElementMarginDirection) {
    }
}

/** All direction CElement margins */
export class CElementMargins {
    private readonly _margins = new Map<CElementMarginDirection, CElementMargin>();

    get top() {
        return this._margins.get(CElementMarginDirection.Top)!;
    }

    get right() {
        return this._margins.get(CElementMarginDirection.Right)!;
    }

    get bottom() {
        return this._margins.get(CElementMarginDirection.Bottom)!;
    }

    get left() {
        return this._margins.get(CElementMarginDirection.Left)!;
    }

    constructor() {
        this._margins.set(CElementMarginDirection.Top, new CElementMargin(0, CElementMarginDirection.Top));
        this._margins.set(CElementMarginDirection.Right, new CElementMargin(0, CElementMarginDirection.Right));
        this._margins.set(CElementMarginDirection.Bottom, new CElementMargin(0, CElementMarginDirection.Bottom));
        this._margins.set(CElementMarginDirection.Left, new CElementMargin(0, CElementMarginDirection.Left));
    }
}