import { CElementLayoutAlign, LayoutAlign, LayoutDisplayMode } from '../features/ui-editor/celement/celement-layout';
import { CanvaElement } from './celement';

export class FlexboxAdapter {
  direction: 'row' | 'column' = 'column';
  alignItems = Align.Left;
  justifyContent = Align.Left;

  syncChildren(parent: CanvaElement, layoutAlign: CElementLayoutAlign) {
    if (layoutAlign.displayMode === LayoutDisplayMode.Absolute) return;

    const children = parent.children;

    if (children.length == 0) return;

    const childrenTotalWidth = children
      .map((x) => x.bound.width)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.bound.width - childrenTotalWidth) / 2;

    let currentX = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      // child.graphics.x = parent.bound.x + currentX;
      child.graphics.x = 0;
      child.graphics.y = 0;
      child.setPosition(parent.bound.x + currentX, parent.bound.y);
      currentX += child.bound.width;
    }
  }
}

export enum Align {
  Left = 1,
  Center = 2,
  Right = 3,
}
