import {
  CElementLayoutAlign,
  FlexDirection,
  LayoutAlign,
  LayoutDisplayMode,
} from "../features/ui-editor/celement/celement-layout";
import { CanvaElement } from "../features/ui-editor/canva-element/canva-element";

export class FlexboxAdapter {
  syncChildren(parent: CanvaElement, layoutAlign: CElementLayoutAlign) {
    if (layoutAlign.displayMode === LayoutDisplayMode.Absolute) return;

    const children = parent.children;

    if (children.length == 0) return;

    switch (layoutAlign.horizontal) {
      case LayoutAlign.AlignStart:
        this.toHorizontalLeft(parent, children, layoutAlign.flexDirection);
        break;
      case LayoutAlign.AlignCenter:
        this.toHorizontalCenter(parent, children, layoutAlign.flexDirection);
        break;
      case LayoutAlign.AliginEnd:
        this.toHorizontalRight(parent, children, layoutAlign.flexDirection);
        break;
    }

    switch (layoutAlign.vertical) {
      case LayoutAlign.AlignStart:
        this.toVerticalBottom(parent, children, layoutAlign.flexDirection);
        break;
      case LayoutAlign.AlignCenter:
        this.toVerticalCenter(parent, children, layoutAlign.flexDirection);
        break;
      case LayoutAlign.AliginEnd:
        this.toVerticalTop(parent, children, layoutAlign.flexDirection);
        break;
    }
  }

  private toHorizontalLeft(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.x;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      // child.graphics.x = parent.bound.x;
      // child.graphics.y = 0;
      child.setTransformation(previousShift, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        previousShift += child.bound.width;
      }
    }
  }

  private toHorizontalCenter(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalWidth = children
      .map((x) => x.bound.width)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.width - childrenTotalWidth) / 2;

    let currentX = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      
      currentX = flexDirection === FlexDirection.Row ? currentX : (parent.bound.width - child.bound.width) / 2;

      child.setTransformation(parent.position.x + currentX, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        currentX += child.bound.width;
      }
    }
  }

  private toHorizontalRight(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.x + parent.bound.width;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(previousShift - child.bound.width, child.position.y);

      if (flexDirection === FlexDirection.Row) {
        previousShift -= child.bound.width;
      }
    }
  }

  private toVerticalCenter(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalHeight = children
      .map((x) => x.bound.height)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.height - childrenTotalHeight) / 2;

    let currentY = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentY = flexDirection === FlexDirection.Column ? currentY : (parent.bound.height - child.bound.height) / 2;
      child.setTransformation(child.position.x, parent.position.y + currentY);

      if (flexDirection === FlexDirection.Column) {
        currentY += child.bound.height;
      }
    }
  }

  private toVerticalTop(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.y;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(child.position.x, previousShift);

      if (flexDirection === FlexDirection.Column) {
        previousShift += child.bound.height;
      }
    }
  }

  private toVerticalBottom(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.position.y + parent.bound.height;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(child.position.x, previousShift - child.bound.height);

      if (flexDirection === FlexDirection.Column) {
        previousShift -= child.bound.height;
      }
    }
  }
}

export enum Align {
  Left = 1,
  Center = 2,
  Right = 3,
}
