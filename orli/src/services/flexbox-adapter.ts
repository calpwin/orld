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
  CElementDimensionExtendMeasurement,
  CElementDimensionMeasurement,
  CElementLayoutGridDimensionMeasurement,
  CElementPositionAxis,
} from "../features/ui-editor/celement/celement";
import { inject, injectable } from "inversify";
import { ApplicationService } from "../features/application/application.service";
import { EditorLayoutGridService } from "../features/ui-editor/editor/editor-layout-grid.service";

@injectable()
export class FlexboxAdapter {
  @inject(ApplicationService)
  private readonly _applicationService!: ApplicationService;

  @inject(EditorLayoutGridService)
  private readonly _editorLayoutGridService!: EditorLayoutGridService;

  constructor() {}

  //#region Sync cael ition

  /* Sync cael children element position for current LayoutAlign */
  syncChildrenPosition(parent: CanvaElement, layoutAlign: CElementLayoutAlign) {
    if (layoutAlign.displayMode === LayoutDisplayMode.Absolute) return;

    const childrenForVerticalSync = parent.children;
    const childrenForHorizopntalSync = parent.children.filter(
      (child) =>
        child.outerBound.width.measurement !==
        CElementLayoutGridDimensionMeasurement.LayoutGrid
    );

    if (childrenForVerticalSync.length == 0) return;

    switch (layoutAlign.horizontal) {
      case LayoutAlign.AlignStart:
        this.toHorizontalLeftPosition(
          parent,
          childrenForHorizopntalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignSpaceBetween:
        this.toHorizontalSpaceBetweenPosition(
          parent,
          childrenForHorizopntalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignCenter:
        this.toHorizontalCenterPosition(
          parent,
          childrenForHorizopntalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignSpaceAround:
        this.toHorizontalSpaceAroundPosition(
          parent,
          childrenForHorizopntalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AliginEnd:
        this.toHorizontalRightPosition(
          parent,
          childrenForHorizopntalSync,
          layoutAlign.flexDirection
        );
        break;
      default:
        throw Error(
          `Layout align: ${
            LayoutAlign[layoutAlign.horizontal]
          } is not supported`
        );
    }

    switch (layoutAlign.vertical) {
      case LayoutAlign.AlignStart:
        this.toVerticalBottomPosition(
          parent,
          childrenForVerticalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignSpaceBetween:
        this.toVerticalSpaceBetweenPosition(
          parent,
          childrenForVerticalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignCenter:
        this.toVerticalCenterPosition(
          parent,
          childrenForVerticalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AlignSpaceAround:
        this.toVerticalSpaceAroundPosition(
          parent,
          childrenForVerticalSync,
          layoutAlign.flexDirection
        );
        break;
      case LayoutAlign.AliginEnd:
        this.toVerticalTopPosition(
          parent,
          childrenForVerticalSync,
          layoutAlign.flexDirection
        );
        break;
      default:
        throw Error(
          `Layout align: ${LayoutAlign[layoutAlign.vertical]} is not supported`
        );
    }
  }

  private toHorizontalLeftPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.innerPosition.x;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        new CElementDimension<CElementDimensionExtendMeasurement>(
          previousShift
        ),
        child.outerPosition.y 
      );

      if (flexDirection === FlexDirection.Row) {
        previousShift += child.outerBound.totalWidthInPx;
      }
    }
  }

  private toHorizontalSpaceBetweenPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    if (flexDirection !== FlexDirection.Row)
      throw Error("Space between for non main axis is not suported");

    const childrenTotalWidth = children
      .map((x) => x.outerBound.totalWidthInPx)
      .reduce((a, b) => a + b, 0);
    const spaceCount = children.length - 1;
    const margin =
      spaceCount > 0
        ? (parent.innerBound.width - childrenTotalWidth) / spaceCount
        : 0;

    let previousShift = parent.innerPosition.x;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(
        new CElementDimension<CElementDimensionExtendMeasurement>(
          previousShift
        ),
        child.outerPosition.y
      );

      previousShift += margin + child.outerBound.totalWidthInPx;
    }
  }

  private toHorizontalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalWidth = children
      .map((x) => x.outerBound.totalWidthInPx)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.innerBound.width - childrenTotalWidth) / 2;

    let currentX = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentX =
        flexDirection === FlexDirection.Row
          ? currentX
          : (parent.innerBound.width - child.outerBound.totalWidthInPx) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(
        new CElementDimension<CElementDimensionExtendMeasurement>(
          parent.innerPosition.x + currentX
        ),
        child.outerPosition.y
      );

      if (flexDirection === FlexDirection.Row) {
        currentX += child.outerBound.totalWidthInPx;
      }
    }
  }

  private toHorizontalSpaceAroundPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    if (flexDirection !== FlexDirection.Row)
      throw Error("Space around for non main axis is not suported");

    const childrenTotalWidth = children
      .map((x) => x.outerBound.totalWidthInPx)
      .reduce((a, b) => a + b, 0);
    const spaceCount = children.length + 1;
    const margin =
      spaceCount > 0
        ? (parent.innerBound.width - childrenTotalWidth) / spaceCount
        : 0;

    let previousShift = parent.innerPosition.x + margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(
        new CElementDimension<CElementDimensionExtendMeasurement>(
          previousShift
        ),
        child.outerPosition.y
      );

      previousShift += margin + child.outerBound.totalWidthInPx;
    }
  }

  private toHorizontalRightPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.innerPosition.x + parent.innerBound.width;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        new CElementDimension<CElementDimensionExtendMeasurement>(
          previousShift - child.outerBound.totalWidthInPx
        ),
        child.outerPosition.y
      );

      if (flexDirection === FlexDirection.Row) {
        previousShift -= child.outerBound.totalWidthInPx;
      }
    }
  }

  private toVerticalTopPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.innerPosition.y;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(child.outerPosition.x, previousShift);

      if (flexDirection === FlexDirection.Column) {
        previousShift += child.outerBound.totalHeihgtInPx;
      }
    }
  }

  private toVerticalSpaceBetweenPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    if (flexDirection !== FlexDirection.Column)
      throw Error("Space between for non main axis is not suported");

    const childrenTotalHeight = children
      .map((x) => x.outerBound.totalHeihgtInPx)
      .reduce((a, b) => a + b, 0);
    const spaceCount = children.length - 1;
    const margin =
      spaceCount > 0
        ? (parent.innerBound.height - childrenTotalHeight) / spaceCount
        : 0;

    let previousShift = parent.innerPosition.y;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(child.outerPosition.x, previousShift);

      previousShift += margin + child.outerBound.totalHeihgtInPx;
    }
  }

  private toVerticalCenterPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    const childrenTotalHeight = children
      .map((x) => x.outerBound.totalHeihgtInPx)
      .reduce((a, b) => a + b, 0);
    const margin = (parent.innerBound.height - childrenTotalHeight) / 2;

    let currentY = margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      currentY =
        flexDirection === FlexDirection.Column
          ? currentY
          : (parent.innerBound.height - child.outerBound.totalHeihgtInPx) / 2;

      child.graphics.position.set(0, 0);
      child.setTransformation(
        child.outerPosition.x,
        parent.innerPosition.y + currentY
      );

      if (flexDirection === FlexDirection.Column) {
        currentY += child.outerBound.totalHeihgtInPx;
      }
    }
  }

  private toVerticalSpaceAroundPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    if (flexDirection !== FlexDirection.Column)
      throw Error("Space around for non main axis is not suported");

    const childrenTotalHeight = children
      .map((x) => x.outerBound.totalHeihgtInPx)
      .reduce((a, b) => a + b, 0);
    const spaceCount = children.length + 1;
    const margin =
      spaceCount > 0
        ? (parent.innerBound.height - childrenTotalHeight) / spaceCount
        : 0;

    let previousShift = parent.innerPosition.y + margin;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.setTransformation(child.outerPosition.x, previousShift);

      previousShift += margin + child.outerBound.totalHeihgtInPx;
    }
  }

  private toVerticalBottomPosition(
    parent: CanvaElement,
    children: CanvaElement[],
    flexDirection: FlexDirection
  ) {
    let previousShift = parent.innerPosition.y + parent.innerBound.height;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      child.graphics.position.set(0, 0);
      child.setTransformation(
        child.outerPosition.x,
        previousShift - child.outerBound.totalHeihgtInPx
      );

      if (flexDirection === FlexDirection.Column) {
        previousShift -= child.outerBound.totalHeihgtInPx;
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
   * Calculate current Cael dimension in Px, mostly need to convert from percent or GreedColumns
   * @param dimension
   * @param axis
   * @param layoutAlign
   * @param parent
   * @param parentLayoutAlign
   * @param otherChildrenCaels Parent children except current one
   * @returns
   */
  calculateCaelDimensionInPx(
    dimension:
      | CElementDimension<CElementDimensionExtendMeasurement>
      | CElementDimension<CElementDimensionMeasurement>,
    axis: CElementDimensionAxis,
    layoutAlign: CElementLayoutAlign,
    parent?: CanvaElement,
    parentLayoutAlign?: CElementLayoutAlign,
    otherChildrenCaels?: CanvaElement[]
  ) {
    if (dimension.measurement === CElementDimensionMeasurement.Px)
      return dimension.value;

    const parentDimValPx =
      axis === CElementDimensionAxis.Width
        ? parent
          ? parent.innerBound.width
          : this._applicationService.app.stage.width
        : parent
        ? parent.innerBound.height
        : this._applicationService.app.stage.height;

    // Flex 1 variant
    if (
      parent &&
      parentLayoutAlign!.displayMode === LayoutDisplayMode.Flex &&
      ((axis === CElementDimensionAxis.Width &&
        parentLayoutAlign!.flexDirection === FlexDirection.Row) ||
        (axis === CElementDimensionAxis.Height &&
          parentLayoutAlign!.flexDirection === FlexDirection.Column)) &&
      dimension.measurement === CElementDimensionMeasurement.Percent &&
      dimension.value === 100
    ) {
      if (axis === CElementDimensionAxis.Width) {
        const sumAllOtherChildrenDimensionInPx = otherChildrenCaels!.reduce(
          (sum, currentChild) => sum + currentChild.outerBound.width.valueInPx,
          0
        );

        return parent.innerBound.width - sumAllOtherChildrenDimensionInPx;
      } else if (axis === CElementDimensionAxis.Height) {
        const sumAllOtherChildrenDimensionInPx = otherChildrenCaels!.reduce(
          (sum, currentChild) => sum + currentChild.outerBound.height.valueInPx,
          0
        );

        return parent.innerBound.height - sumAllOtherChildrenDimensionInPx;
      } else
        throw Error(
          `Dimension axis ${CElementDimensionAxis[axis]} is not suppported`
        );
    }

    if (dimension.measurement === CElementDimensionMeasurement.Percent) {
      return parentDimValPx * (dimension.value / 100);
    }

    if (
      dimension.measurement ===
      CElementLayoutGridDimensionMeasurement.LayoutGrid
    ) {
      return this._editorLayoutGridService.calculateDimensionColumnsInPx(
        dimension.value
      );
    }

    throw Error(
      `Current dimension type ${dimension.measurement} is not suppported`
    );
  }

  /**
   * Calculate current Cael position in Px, mostly need to convert from percent or GreedColumns
   * @param position
   * @param axis
   * @param layoutAlign
   * @param parent
   * @returns
   */
  calculateCaelPositionInPx(
    position:
      | CElementDimension<CElementDimensionExtendMeasurement>
      | CElementDimension<CElementDimensionMeasurement>,
    axis: CElementPositionAxis,
    layoutAlign: CElementLayoutAlign,
    parent: CanvaElement
  ) {
    if (position.measurement === CElementDimensionMeasurement.Px)
      return position.value;

    if (
      position.measurement === CElementLayoutGridDimensionMeasurement.LayoutGrid
    ) {
      return (
        parent.innerPosition.x +
        this._editorLayoutGridService.calculatePositionColumnsInPx(
          position.value
        )
      );
    }

    throw Error(
      `Current position type ${position.measurement} is not suppported`
    );
  }
}

export enum Align {
  Left = 1,
  Center = 2,
  Right = 3,
}
