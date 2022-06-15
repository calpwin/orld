import { Graphics, Rectangle, InteractionEvent } from "pixi.js";
import { Subject } from "rxjs";

import { watch } from "../../../rx/watch";
import store from "../../../rx/store";

import {
  celementAddAction,
  celementSelectAction,
} from "../celement/celemet.actions";
import {
  CElement,
  CElementDimension,
  CElementDimensionAxis,
  CElementDimensionMeasurement,
} from "../celement/celement";
import { CanvaElementResizer, ResizerDirection } from "./canva-element-resizer";
import { CanvaElementResizers } from "./CanvaElementResizers";
import { lastCElementTransformedSelector } from "../celement/celement.selectors";
import { FlexboxAdapter } from "../../../services/flexbox-adapter";
import {
  CElementLayoutAlign,
  LayoutDisplayMode,
} from "../celement/celement-layout";
import { CanvaElementDimension } from "./canva-element-dimension";
import { Ioc } from "../../../base/config.inversify";
import {
  CElementIndent,
  CElementMarginDirection,
  CElementIndents,
} from "../celement/celement-margin";

export class CanvaElement {
  private readonly _resizers = new CanvaElementResizers();
  private readonly _flexboxAdapter: FlexboxAdapter;

  readonly id!: string;

  private _rectangle!: Graphics;
  private _rectMoving = false;
  private _rectangleFill!: number;

  private _outerX!: number;
  private _outerY!: number;
  private _outerWidth!: CanvaElementDimension;
  private _outerHeight!: CanvaElementDimension;
  private readonly _margins = new CElementIndents(
    // new CElementIndent(5, CElementMarginDirection.Top),
    // new CElementIndent(15, CElementMarginDirection.Right),
    // new CElementIndent(10, CElementMarginDirection.Bottom),
    // new CElementIndent(0, CElementMarginDirection.Left)
  );
  private readonly _paddings = new CElementIndents(
    new CElementIndent(10, CElementMarginDirection.Top),
    new CElementIndent(10, CElementMarginDirection.Right),
    new CElementIndent(10, CElementMarginDirection.Bottom),
    new CElementIndent(20, CElementMarginDirection.Left)
  );

  //#region Inner bound and position. Calculate automatically -> should not be setup manually
  private _innerX!: number;
  private _innerY!: number;
  private _innerWidthInPx!: number;
  private _innerHeightInPx!: number;
  //#endregion

  /** Is current Cael selected */
  private _isSelected = false;

  // Is current Cael can be moved
  private _isMovaeble = true;

  private _parent?: CanvaElement;
  private readonly _children = new Map<string, CanvaElement>();

  /** Bound with margings */
  get outerBound() {
    return new CanvaElementBound(
      this._outerWidth,
      this._outerHeight,
      this._margins,
      this._paddings
    );
  }

  /** Bound in px without margings and padding,
   *  where children Cael insert */
  get innerBound() {
    return {
      width: this._innerWidthInPx,
      height: this._innerHeightInPx
    }
  }

  /** Position with margings */
  get outerPosition() {
    return new CanvaElementPosition(this._outerX, this._outerY);
  }

  /** Position without margings and padding,
   *  where children Cael insert */
  get innerPosition() {
    return new CanvaElementPosition(this._innerX, this._innerY);
  }

  get parent() {
    return this._parent;
  }

  set parent(value: CanvaElement | undefined) {
    this._parent = value;
  }

  get children() {
    return Array.from(this._children.values());
  }

  get graphics() {
    return this._rectangle;
  }

  get resizers() {
    return this._resizers;
  }

  get isSelected() {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;

    if (this._isSelected) {
      this.addResizers();
    } else {
      this.removeResizers();
    }

    this.redraw();
  }

  /* Is element can be moved */
  get isMovaeble() {
    return this._isMovaeble;
  }
  /* Is element can be moved */
  set isMovaeble(value: boolean) {
    this._isMovaeble = value;
  }

  onResizeStop = new Subject<string>();

  constructor() {
    this.id = this.createId();

    this._flexboxAdapter = Ioc.Conatiner.get<FlexboxAdapter>(FlexboxAdapter);

    this.bindEvents();
  }

  create(
    x: number,
    y: number,
    width: CElementDimension,
    height: CElementDimension,
    fill = 0xffffff
  ) {
    const layoutAling = new CElementLayoutAlign();

    const widthInPx = this._flexboxAdapter.calculateCaelDimensionInPx(
      width,
      CElementDimensionAxis.Width,
      layoutAling,
      undefined
    );
    const heightInPx = this._flexboxAdapter.calculateCaelDimensionInPx(
      height,
      CElementDimensionAxis.Height,
      layoutAling,
      undefined
    ); // TODO set parent

    this._rectangle = new Graphics();
    this._rectangle.interactive = true;
    this._outerX = x;
    this._outerY = y;
    this._outerWidth = new CanvaElementDimension(
      width.value,
      widthInPx,
      width.measurement
    );
    this._outerHeight = new CanvaElementDimension(
      height.value,
      heightInPx,
      height.measurement
    );
    this._rectangleFill = fill;

    this.synchronizeInnerBoundAndPosition();

    this.redraw();

    this._rectangle.on("mouseup", (event) => {
      this._resizers.stopMoving();
    });

    this.makeMovable();

    store.dispatch(
      celementAddAction({
        cel: new CElement(
          this.id,
          this._outerX,
          this._outerY,
          this._outerWidth,
          this._outerHeight,
          this._margins,
          this._paddings
        ),
      })
    );

    return this._rectangle;
  }

  addChild(child: CanvaElement) {
    this._rectangle.addChild(child._rectangle);
    this._children.set(child.id, child);

    child.parent = this;
  }

  getChild(child: CanvaElement) {
    return this._children.get(child.id);
  }

  /* 
    Set element transformation
  */
  setTransformation(
    x?: number,
    y?: number,
    width?: CElementDimension,
    height?: CElementDimension,
    margings?: CElementIndent[],
    paddings?: CElementIndent[]
  ) {
    const layoutAlign = store.getState().editor.celements[this.id].layoutAlign;
    const widthInPx = width
      ? this._flexboxAdapter.calculateCaelDimensionInPx(
          width,
          CElementDimensionAxis.Width,
          layoutAlign,
          this._parent
        )
      : null;
    const heightInPx = height
      ? this._flexboxAdapter.calculateCaelDimensionInPx(
          height,
          CElementDimensionAxis.Height,
          layoutAlign,
          this._parent
        )
      : null;

    let changedAxis =
      CElementDimensionAxis.Width | CElementDimensionAxis.Height;
    !width && (changedAxis &= ~CElementDimensionAxis.Width);
    !height && (changedAxis &= ~CElementDimensionAxis.Height);

    this._outerX = x ?? this._outerX;
    this._outerY = y ?? this._outerY;
    this._outerWidth = widthInPx
      ? new CanvaElementDimension(width!.value, widthInPx, width!.measurement)
      : this._outerWidth;
    this._outerHeight = heightInPx
      ? new CanvaElementDimension(
          height!.value,
          heightInPx,
          height!.measurement
        )
      : this._outerHeight;

    margings?.forEach((margin) => this._margins.set(margin));
    paddings?.forEach((padding) => this._paddings.set(padding));

    this.synchronizeInnerBoundAndPosition();

    this.applyTransformation(changedAxis);
  }

  /* 
    redraw cel from its properties
   */
  redraw() {
    this._rectangle.clear();
    this._rectangle.beginFill(this._rectangleFill);

    if (this._isSelected) {
      this._rectangle.lineStyle(2, 0x1555ed);
    }

    this._rectangle.drawRect(
      this._outerX + this._margins.left.value,
      this._outerY + this._margins.top.value,
      this._outerWidth.valueInPx,
      this._outerHeight.valueInPx
    );
    this._rectangle.hitArea = new Rectangle(
      this._outerX - 10,
      this._outerY - 10,
      this._outerWidth.valueInPx + 20,
      this._outerHeight.valueInPx + 20
    );

    this._rectangle.lineStyle();

    this._rectangle.endFill();

    this.drawMargins();
    this.drawPaddings();

    this._resizers.updateResizeresPosition(this.outerPosition, this.outerBound);
  }

  private drawMargins() {
    this._rectangle.beginFill(0xfd5d71);

    if (this._margins.top.isSet)
      this._rectangle.drawRect(
        this._outerX,
        this._outerY,
        this.outerBound.totalWidthInPx,
        this._margins.top.value
      );

    if (this._margins.right.isSet)
      this._rectangle.drawRect(
        this._outerX + this._margins.left.value + this._outerWidth.valueInPx,
        this._outerY,
        this._margins.right.value,
        this.outerBound.totalHeihgtInPx
      );

    if (this._margins.bottom.isSet)
      this._rectangle.drawRect(
        this._outerX,
        this._outerY + this._margins.top.value + this._outerHeight.valueInPx,
        this.outerBound.totalWidthInPx,
        this._margins.bottom.value
      );

    if (this._margins.left.isSet)
      this._rectangle.drawRect(
        this._outerX,
        this._outerY,
        this._margins.left.value,
        this.outerBound.totalHeihgtInPx
      );

    this._rectangle.endFill();
  }

  private drawPaddings() {
    this._rectangle.beginFill(0x40fcbf);

    if (this._paddings.top.isSet)
      this._rectangle.drawRect(
        this._outerX + this._margins.left.value,
        this._outerY + this._margins.top.value,
        this.outerBound.width.valueInPx,
        this._paddings.top.value
      );

    if (this._paddings.right.isSet)
      this._rectangle.drawRect(
        this._outerX + this._margins.left.value + this._outerWidth.valueInPx - this._paddings.right.value,
        this._outerY + this._margins.top.value,
        this._paddings.right.value,
        this.outerBound.height.valueInPx
      );

    if (this._paddings.bottom.isSet)
      this._rectangle.drawRect(
        this._outerX + this._margins.left.value,
        this._outerY + this._margins.top.value + this._outerHeight.valueInPx - this._paddings.bottom.value,
        this.outerBound.width.valueInPx,
        this._paddings.bottom.value
      );

    if (this._paddings.left.isSet)
      this._rectangle.drawRect(
        this._outerX + this._margins.left.value,
        this._outerY + this._margins.top.value,
        this._paddings.left.value,
        this.outerBound.height.valueInPx
      );

    this._rectangle.endFill();
  }

  private bindEvents() {
    const wlastCElementTransformed = watch(() =>
      lastCElementTransformedSelector(store.getState().editor)
    );
    store.subscribe(
      wlastCElementTransformed((newVal, oldVal) => {
        if (
          !newVal ||
          newVal.celId !== this.id ||
          newVal.transformation.isEmpty()
        )
          return;

        this.setTransformation(
          newVal.transformation.x,
          newVal.transformation.y,
          newVal.transformation.width,
          newVal.transformation.height,
          newVal.transformation.margins,
          newVal.transformation.paddings
        );
      })
    );
  }

  /**
   * Synchronize current Cael bound with parent ones.
   * Mostly need for current Cael percent dimensions
   * @param parentChangeDimensionAxis
   * @returns
   */
  synchronizeBoundWithParent(
    parentChangeDimensionAxis?: CElementDimensionAxis
  ) {
    if (!this.parent) return;

    let needRedraw = false;
    let changedAxis =
      CElementDimensionAxis.Width | CElementDimensionAxis.Height;

    if (
      this.outerBound.width.measurement === CElementDimensionMeasurement.Percent &&
      (!parentChangeDimensionAxis ||
        (parentChangeDimensionAxis & CElementDimensionAxis.Width) ===
          CElementDimensionAxis.Width)
    ) {
      const updatedWidthInPx =
        (this.parent.outerBound.totalWidthInPx * this.outerBound.width.value) / 100;
      if (updatedWidthInPx !== this._outerWidth.valueInPx) {
        this._outerWidth.valueInPx = updatedWidthInPx;
        needRedraw = true;
      } else {
        changedAxis &= ~CElementDimensionAxis.Width;
      }
    }

    if (
      this.outerBound.height.measurement === CElementDimensionMeasurement.Percent &&
      (!parentChangeDimensionAxis ||
        (parentChangeDimensionAxis & CElementDimensionAxis.Height) ===
          CElementDimensionAxis.Height)
    ) {
      const updatedHeightInPx =
        (this.parent.outerBound.totalHeihgtInPx * this.outerBound.height.value) / 100;
      if (updatedHeightInPx !== this._outerHeight.valueInPx) {
        this._outerHeight.valueInPx = updatedHeightInPx;
        needRedraw = true;
      } else {
        changedAxis &= ~CElementDimensionAxis.Height;
      }
    }

    if (needRedraw) {
      this.applyTransformation(changedAxis);
    }
  }

  /** Synchronize inner x, y, width, height with outer and margins, paddings */
  private synchronizeInnerBoundAndPosition() {
    this._innerX = this._outerX + this._margins.left.value + this._paddings.left.value;
    this._innerY = this._outerY + this._margins.top.value + this._paddings.top.value;

    this._innerWidthInPx =
      this._outerWidth.valueInPx -      
      (this._paddings.left.value + this._paddings.right.value);

    this._innerHeightInPx =
      this._outerHeight.valueInPx -      
      (this._paddings.top.value + this._paddings.bottom.value);
  }

  /**
   * Apply Canva Element transformation (redraw element, sync resizers, update children bound eth)
   * @param changedAxis What axis was changed
   */
  private applyTransformation(changedAxis?: CElementDimensionAxis) {
    const layoutAlign = store.getState().editor.celements[this.id].layoutAlign;

    this.redraw();
    this._resizers.updateResizeresPosition(this.outerPosition, this.outerBound);

    // disable movaeble for children if parent container not in Absolute display mode
    this._children.forEach(
      (x) =>
        (x.isMovaeble = layoutAlign.displayMode === LayoutDisplayMode.Absolute)
    );

    this._flexboxAdapter.syncChildrenBound(this, changedAxis);
    this._flexboxAdapter.syncChildrenPosition(this, layoutAlign);
  }

  private addResizers() {
    [
      new CanvaElementResizer(ResizerDirection.Left, this),
      new CanvaElementResizer(ResizerDirection.Top, this),
      new CanvaElementResizer(ResizerDirection.Right, this),
      new CanvaElementResizer(ResizerDirection.Bottom, this),
    ].forEach((x) => {
      this._rectangle.addChild(x.circle);
      this._resizers.set(x.direction, x);
    });
  }

  private removeResizers() {
    // this._rectangle.removeChildren();
    this._resizers.forEach((x) => {
      this._rectangle.removeChild(x.circle);
    });

    this._resizers.clear();
  }

  private makeMovable() {
    let startMoveX = 0;
    let startMoveY = 0;

    this._rectangle.on("click", (event: InteractionEvent) => {
      event.stopPropagation();

      store.dispatch(celementSelectAction({ celId: this.id }));
    });

    this._rectangle.on("mousedown", (event: InteractionEvent) => {
      if (!this._isMovaeble) {
        event.stopped = true;
        event.stopPropagationHint = true;
        event.stopPropagation();
        return;
      }

      this._rectMoving = true;
      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      event.stopped = true;
      event.stopPropagationHint = true;
      event.stopPropagation();
    });

    this._rectangle.on("mousemove", (event: InteractionEvent) => {
      if (!this._isMovaeble || !this._rectMoving || this._resizers.isMoving)
        return;

      this._rectangle.x += event.data.global.x - startMoveX;
      this._rectangle.y += event.data.global.y - startMoveY;

      startMoveX = event.data.global.x;
      startMoveY = event.data.global.y;

      event.stopPropagation();
    });

    this._rectangle.on("mouseup", (event: InteractionEvent) => {
      if (!this._isMovaeble) return;

      this._rectMoving = false;

      event.stopPropagation();
    });
  }

  private createId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export class CanvaElementPosition {
  constructor(public x: number, public y: number) {}
}

export class CanvaElementBound {
  private _width: CanvaElementDimension;
  private _height: CanvaElementDimension;
  private _margins: CElementIndents;
  private _paddings: CElementIndents;

  /** Cael width in px with margins */
  private _totalWidthInPx!: number;
  /** Cael height in px with margins */
  private _totalHeightInPx!: number;

  /** Cael width in px with margins */
  get totalWidthInPx() {
    return this._totalWidthInPx;
  }

  /** Cael height in px with margins */
  get totalHeihgtInPx() {
    return this._totalHeightInPx;
  }

  get width() {
    return this._width;
  }

  set width(value: CanvaElementDimension) {
    this._width = value;

    this.syncTotalDimensions();
  }

  get height() {
    return this._height;
  }

  set height(value: CanvaElementDimension) {
    this._height = value;

    this.syncTotalDimensions();
  }

  /** You should update margins by @see CanvaElementBound.setMargin */
  get margins() {
    return this._margins;
  }

  /** Update margin with total dimension synchronization */
  setMargin(margin: CElementIndent) {
    this._margins.set(margin);

    this.syncTotalDimensions();
  }

  /** You should update paddings by @see CanvaElementBound.setPadding */
  get paddings() {
    return this._paddings;
  }

  /** Update padding with total dimension synchronization */
  setPadding(padding: CElementIndent) {
    this._paddings.set(padding);
  }

  constructor(
    width: CanvaElementDimension,
    height: CanvaElementDimension,
    margins?: CElementIndents,
    paddings?: CElementIndents
  ) {
    this._width = width;
    this._height = height;
    this._margins = margins ?? new CElementIndents();
    this._paddings = paddings ?? new CElementIndents();

    this.syncTotalDimensions();
  }

  /**
   * Synchronize Cael dimension value in px with margins
   * */
  private syncTotalDimensions() {
    this._totalWidthInPx =
      this._width.valueInPx +
      this._margins.left.value +
      this._margins.right.value;
    this._totalHeightInPx =
      this._height.valueInPx +
      this._margins.top.value +
      this._margins.bottom.value;
  }
}
