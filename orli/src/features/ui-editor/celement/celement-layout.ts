export enum LayoutAlign {
  AlignCenter = 1,
  AlignStart = 2,
  AliginEnd = 3,
  None = 4,
}

export enum LayoutOrientation {
  Vertical = 1,
  Horizontal = 2,
}

/* 
  Direction of flex layout
 */
export enum FlexDirection {
  Row = 1,
  Column = 2,
}

export enum LayoutDisplayMode {
  Absolute = 1,
  Flex = 2,
}

export class CElementLayoutAlign {  
  displayMode = LayoutDisplayMode.Flex;

  flexDirection = FlexDirection.Row;
  vertical = LayoutAlign.AlignCenter;
  horizontal = LayoutAlign.AlignCenter;
}
export interface CElementLayoutAlignUpdate {
  displayMode?: LayoutDisplayMode;

  flexDirection?: FlexDirection;
  vertical?: LayoutAlign;
  horizontal?: LayoutAlign;
}
