import {
  CElementLayoutAlign,
  FlexDirection,
  LayoutAlign,
  LayoutDisplayMode,
} from "../features/ui-editor/celement/celement-layout";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";
import {
  CElementDimension,
  CElementDimensionAxis,
  CElementDimensionMeasurement,
} from "../features/ui-editor/celement/celement";
import { EditorService } from "./editor.service";
import { Ioc } from "../base/config.inversify";

export class FlexboxAdapter {

  private readonly _editorService: EditorService;

  constructor() {
    this._editorService = Ioc.Conatiner.get<EditorService>(EditorService);    
  }

  //#region Sync cael position

  /* Sync cael children element position for current LayoutAlign */
  syncChildrenPosition(parent: CanvaElement, layoutAlign: CElementLayoutAlign) {
    if (layoutAlign.displayMode === LayoutDisplayMode.Absolute) return;

    const children = parent.children;

    if (children.length == 0) return;

    switch (layoutAlign.horizontal) {
      case LayoutAlign.AlignStart:
        this.toHorizontalLeftPosition(
          parent,
          children,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignCenter:
        this.toHorizontalCenterPosition(
          parent,
          children,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AliginEnd:
        this.toHorizontalRightPosition(
          parent,
          children,
          layoutAlign.flexDirection
        );
        break;
    }

    switch (layoutAlign.vertical) {
      case LayoutAlign.AlignStart:
        this.toVerticalBottomPosition(
          parent,
          children,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignCenter:
        this.toVerticalCenterPosition(
          parent,
          children,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AliginEnd:
        this.toVerticalTopPosition(parent, children, layoutAlign.flexDirection);
        break;
    }
  }

  private toHorizontalLeftPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.x;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(previousShift, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        previousShift += child.bound.width.value;
      }
    }
  }

  private toHorizontalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalWidth = children
      .map((x) => x.bound.width.value)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.width.value - childrenTotalWidth) / 2;

    let currentX = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentX =
        flexDirection === FlexDirection.Row
          ? currentX
          : (parent.bound.width.value - child.bound.width.value) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(parent.position.x + currentX, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        currentX += child.bound.width.value;
      }
    }
  }

  private toHorizontalRightPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.x + parent.bound.width.value;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        previousShift - child.bound.width.value,
        child.position.y
      );

      if (flexDirection === FlexDirection.Row) {
        previousShift -= child.bound.width.value;
      }
    }
  }

  private toVerticalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalHeight = children
      .map((x) => x.bound.height.value)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.height.value - childrenTotalHeight) / 2;

    let currentY = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentY =
        flexDirection === FlexDirection.Column
          ? currentY
          : (parent.bound.height.value - child.bound.height.value) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(child.position.x, parent.position.y + currentY);

      if (flexDirection === FlexDirection.Column) {
        currentY += child.bound.height.value;
      }
    }
  }

  private toVerticalTopPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.y;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(child.position.x, previousShift);

      if (flexDirection === FlexDirection.Column) {
        previousShift += child.bound.height.value;
      }
    }
  }

  private toVerticalBottomPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.y + parent.bound.height.value;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        child.position.x,
        previousShift - child.bound.height.value
      );

      if (flexDirection === FlexDirection.Column) {
        previousShift -= child.bound.height.value;
      }
    }
  }

  //#endregion

  /*  */
  public calculateCaelDimensionInPx(
    dimension: CElementDimension,
    axis: CElementDimensionAxis,
    layoutAlign: CElementLayoutAlign,
    parent?: CanvaElement
  ) {
    if (dimension.measurement === CElementDimensionMeasurement.Px)
      return dimension.value;    

    const parentDimValPx =
      axis === CElementDimensionAxis.Width
        ? parent
          ? parent.bound.width.valueInPx
          : this._editorService.app.stage.width
        : parent
        ? parent.bound.height.valueInPx
        : this._editorService.app.stage.height;

    if (dimension.measurement === CElementDimensionMeasurement.Percent) {
      return parentDimValPx * (dimension.value / 100);
    }

    throw Error(
      `Current dimension type ${dimension.measurement} is not suppported`
    );
  }
}

export enum Align {
  Left = 1,
  Center = 2,
  Right = 3,
}
