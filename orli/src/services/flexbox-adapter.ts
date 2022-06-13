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
import { inject, injectable } from "inversify";

@injectable()
export class FlexboxAdapter {
  
  @inject(EditorService)
  private readonly _editorService!: EditorService;

  constructor() {    
  }

  //#region Sync cael ition

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
        previousShift += child.bound.width.valueInPx;
      }
    }
  }

  private toHorizontalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalWidth = children
      .map((x) => x.bound.width.valueInPx)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.width.valueInPx - childrenTotalWidth) / 2;

    let currentX = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentX =
        flexDirection === FlexDirection.Row
          ? currentX
          : (parent.bound.width.valueInPx - child.bound.width.valueInPx) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(parent.position.x + currentX, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        currentX += child.bound.width.valueInPx;
      }
    }
  }

  private toHorizontalRightPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.x + parent.bound.width.valueInPx;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        previousShift - child.bound.width.valueInPx,
        child.position.y
      );

      if (flexDirection === FlexDirection.Row) {
        previousShift -= child.bound.width.valueInPx;
      }
    }
  }

  private toVerticalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalHeight = children
      .map((x) => x.bound.height.valueInPx)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.height.valueInPx - childrenTotalHeight) / 2;

    let currentY = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentY =
        flexDirection === FlexDirection.Column
          ? currentY
          : (parent.bound.height.valueInPx - child.bound.height.valueInPx) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(child.position.x, parent.position.y + currentY);

      if (flexDirection === FlexDirection.Column) {
        currentY += child.bound.height.valueInPx;
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
        previousShift += child.bound.height.valueInPx;
      }
    }
  }

  private toVerticalBottomPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.y + parent.bound.height.valueInPx;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        child.position.x,
        previousShift - child.bound.height.valueInPx
      );

      if (flexDirection === FlexDirection.Column) {
        previousShift -= child.bound.height.valueInPx;
      }
    }
  }

  //#endregion

  /**
   * Synchronize children bound to parent
   * @param parent
   * @param layoutAlign
   * @param parentChangeDimensionAxis If set only this dimension will be analize
   */
  syncChildrenBound(
    parent: CanvaElement,
    parentChangeDimensionAxis?: CElementDimensionAxis
  ) {
    parent.children.forEach((child) => {
      child.synchronizeBoundWithParent(parentChangeDimensionAxis);
    });
  }

  /**
   * Calculate current Canv Element dimension in Px, mostly need to convert from percent
   * @param dimension
   * @param axis
   * @param layoutAlign
   * @param parent
   * @returns
   */
  calculateCaelDimensionInPx(
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
